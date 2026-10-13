import { useEffect, useMemo, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Great-circle arcs between locations, plus a marker at each endpoint.
 *
 * Everything lives in one LineSegments and one Points object — per-arc timing
 * rides along as vertex attributes rather than as separate draw calls.
 */

const SEGMENTS_PER_ARC = 96
// Fraction of a cycle spent drawing the arc in, then holding, then fading.
const DRAW_END = 0.35
const FADE_START = 0.75

type Coord = [lat: number, lon: number]

const ROUTES: Array<[Coord, Coord]> = [
  [[29.65, -82.32], [51.51, -0.13]],    // Gainesville  -> London
  [[37.77, -122.42], [35.68, 139.69]],  // San Francisco -> Tokyo
  [[40.71, -74.01], [52.52, 13.4]],     // New York     -> Berlin
  [[1.35, 103.82], [-33.87, 151.21]],   // Singapore    -> Sydney
  [[25.2, 55.27], [-1.29, 36.82]],      // Dubai        -> Nairobi
  [[-23.55, -46.63], [-33.92, 18.42]],  // Sao Paulo    -> Cape Town
  [[19.43, -99.13], [40.42, -3.7]],     // Mexico City  -> Madrid
  [[28.61, 77.21], [55.75, 37.62]],     // Delhi        -> Moscow
]

/**
 * Matches the equirectangular mapping the globe texture is drawn with, so an
 * arc endpoint lands on the country it names.
 *
 * three's SphereGeometry writes uv.y = 1 - v and flips the texture on upload,
 * which puts latitude at theta = PI/2 - phi. Longitude picks up a half turn
 * from u = (lon + 180) / 360, and the geometry's own negated x cancels back
 * out — leaving z negated relative to the textbook form.
 */
export function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(lat)
  const lambda = THREE.MathUtils.degToRad(lon)
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.cos(lambda),
    radius * Math.sin(phi),
    -radius * Math.cos(phi) * Math.sin(lambda)
  )
}

const arcVertexShader = /* glsl */ `
  attribute float aT;
  attribute float aPhase;
  varying float vT;
  varying float vPhase;

  void main() {
    vT = aT;
    vPhase = aPhase;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const arcFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uOpacity;
  varying float vT;
  varying float vPhase;

  void main() {
    float cyc = fract(uTime * 0.09 + vPhase);

    // How far along the arc the leading edge has travelled this cycle.
    float reveal = smoothstep(0.0, ${DRAW_END.toFixed(2)}, cyc);

    // Visible only behind the leading edge.
    float on = 1.0 - smoothstep(reveal - 0.012, reveal + 0.012, vT);

    float fadeIn  = smoothstep(0.0, 0.03, cyc);
    float fadeOut = 1.0 - smoothstep(${FADE_START.toFixed(2)}, 1.0, cyc);

    // Bright head that rides the leading edge while the arc is drawing.
    float head = smoothstep(0.05, 0.0, abs(vT - reveal))
               * (1.0 - smoothstep(${DRAW_END.toFixed(2)}, ${(DRAW_END + 0.05).toFixed(2)}, cyc));

    float alpha = on * fadeIn * fadeOut * uOpacity;
    gl_FragColor = vec4(uColor * (1.0 + head * 2.5), alpha);
  }
`

const markerVertexShader = /* glsl */ `
  attribute float aPhase;
  attribute float aIsDest;
  uniform float uTime;
  uniform float uSize;
  varying float vAlpha;

  void main() {
    float cyc = fract(uTime * 0.09 + aPhase);

    // Origin lights up as the arc leaves it; the destination only once the
    // arc has actually arrived.
    float appear = aIsDest > 0.5
      ? smoothstep(${DRAW_END.toFixed(2)}, ${(DRAW_END + 0.05).toFixed(2)}, cyc)
      : smoothstep(0.0, 0.04, cyc);
    float fadeOut = 1.0 - smoothstep(${FADE_START.toFixed(2)}, 1.0, cyc);
    vAlpha = appear * fadeOut;

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

const markerFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;

    float core = smoothstep(0.22, 0.0, d);
    float ring = smoothstep(0.5, 0.42, d) * smoothstep(0.30, 0.38, d);

    float alpha = (core + ring) * vAlpha;
    gl_FragColor = vec4(uColor * (1.0 + core + ring * 1.5), alpha);
  }
`

interface ArcsProps {
  radius: number
  /** Scene clock, so arcs share the GUI speed control. */
  timeRef: RefObject<number>
  color: string
}

export function Arcs({ radius, timeRef, color }: ArcsProps) {
  const { gl } = useThree()

  const { lines, points } = useMemo(() => {
    const positions: number[] = []
    const ts: number[] = []
    const phases: number[] = []

    const markerPositions: number[] = []
    const markerPhases: number[] = []
    const markerIsDest: number[] = []

    ROUTES.forEach(([from, to], routeIndex) => {
      const a = latLonToVec3(from[0], from[1], 1)
      const b = latLonToVec3(to[0], to[1], 1)
      const phase = routeIndex / ROUTES.length

      // Longer routes bow higher, the way a real flight path reads.
      const angle = a.angleTo(b)
      const lift = 0.06 + 0.28 * (angle / Math.PI)

      const sinAngle = Math.sin(angle)
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= SEGMENTS_PER_ARC; i++) {
        const t = i / SEGMENTS_PER_ARC

        // Slerp keeps the path on a great circle and, unlike normalised lerp,
        // spaces the samples evenly so the leading head travels at a constant
        // rate. Degenerate only when the endpoints coincide.
        const p =
          sinAngle < 1e-6
            ? a.clone()
            : a
                .clone()
                .multiplyScalar(Math.sin((1 - t) * angle) / sinAngle)
                .addScaledVector(b, Math.sin(t * angle) / sinAngle)

        // Lift off the surface, peaking at the midpoint.
        p.normalize().multiplyScalar(radius * (1 + lift * Math.sin(Math.PI * t)))
        pts.push(p)
      }

      for (let i = 0; i < SEGMENTS_PER_ARC; i++) {
        const p0 = pts[i]
        const p1 = pts[i + 1]
        positions.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z)
        ts.push(i / SEGMENTS_PER_ARC, (i + 1) / SEGMENTS_PER_ARC)
        phases.push(phase, phase)
      }

      const start = pts[0]
      const end = pts[pts.length - 1]
      markerPositions.push(start.x, start.y, start.z, end.x, end.y, end.z)
      markerPhases.push(phase, phase)
      markerIsDest.push(0, 1)
    })

    const arcGeometry = new THREE.BufferGeometry()
    arcGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )
    arcGeometry.setAttribute('aT', new THREE.Float32BufferAttribute(ts, 1))
    arcGeometry.setAttribute(
      'aPhase',
      new THREE.Float32BufferAttribute(phases, 1)
    )

    const arcMaterial = new THREE.ShaderMaterial({
      vertexShader: arcVertexShader,
      fragmentShader: arcFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color() },
        uOpacity: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const markerGeometry = new THREE.BufferGeometry()
    markerGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(markerPositions, 3)
    )
    markerGeometry.setAttribute(
      'aPhase',
      new THREE.Float32BufferAttribute(markerPhases, 1)
    )
    markerGeometry.setAttribute(
      'aIsDest',
      new THREE.Float32BufferAttribute(markerIsDest, 1)
    )

    const markerMaterial = new THREE.ShaderMaterial({
      vertexShader: markerVertexShader,
      fragmentShader: markerFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color() },
        uSize: { value: 60 * gl.getPixelRatio() },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return {
      lines: new THREE.LineSegments(arcGeometry, arcMaterial),
      points: new THREE.Points(markerGeometry, markerMaterial),
    }
    // Colour is applied by the effect below, not baked in here — rebuilding
    // every arc's geometry just to recolour it would be wasteful.
  }, [radius, gl])

  useEffect(() => {
    ;(lines.material as THREE.ShaderMaterial).uniforms.uColor.value.set(color)
    ;(points.material as THREE.ShaderMaterial).uniforms.uColor.value.set(color)
  }, [color, lines, points])

  useEffect(() => {
    return () => {
      lines.geometry.dispose()
      ;(lines.material as THREE.Material).dispose()
      points.geometry.dispose()
      ;(points.material as THREE.Material).dispose()
    }
  }, [lines, points])

  useFrame(() => {
    const t = timeRef.current
    ;(lines.material as THREE.ShaderMaterial).uniforms.uTime.value = t
    ;(points.material as THREE.ShaderMaterial).uniforms.uTime.value = t
  })

  return (
    <>
      <primitive object={lines} />
      <primitive object={points} />
    </>
  )
}

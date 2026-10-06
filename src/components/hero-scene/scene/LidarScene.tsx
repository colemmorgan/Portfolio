import { useRef, useEffect, useMemo, useState } from 'react'
import type GUI from 'lil-gui'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import vertexShader from '../shaders/lidar/vertex.glsl'
import fragmentShader from '../shaders/lidar/fragment.glsl'

import { loadLpc, type CloudGeometry } from './lidarFormat'
import { LIDAR_CLOUDS } from '@/data/lidarClouds'

/**
 * A real airborne LiDAR capture (USGS 3DEP, Lower Manhattan) rendered as a
 * point cloud, with a scan front sweeping through it on a loop.
 *
 * The clouds are built offline: scripts/lidar/build_cloud.py fetches the crop,
 * cull_to_view.py drops what this camera can never see, and pack_cloud.py
 * compresses it to .lpc.
 */

// Two tiers, each culled to its frame. The vertical field of view is fixed,
// so a portrait screen sees a far narrower strip of the city.
const CLOUDS = {
  wide: LIDAR_CLOUDS['manhattan-wide'],         // any landscape screen up to 21:9
  portrait: LIDAR_CLOUDS['manhattan-portrait'], // width <= height
}
type Tier = keyof typeof CLOUDS
const tierFor = (width: number, height: number): Tier =>
  width / height < 1 ? 'portrait' : 'wide'

const COLOR_MODES = { Height: 0, Intensity: 1 }
// On a portrait screen only a narrow strip of the sweep is in frame, so the
// front spends most of each pass out of sight. Shorten the pass to match.
const PORTRAIT_SWEEP_SCALE = 0.7
// Cool-down is measured per pass, so a shorter pass also fades hits faster in
// real time. Ease it off on portrait so the trail lasts a touch longer there
// than on desktop: 9 s / 14 = 0.64 s per e-fold vs 6.3 s / 9.1 = 0.69 s.
const PORTRAIT_DECAY_SCALE = 0.65
const SWEEP_MODES = { Linear: 0, Radial: 1 }

// Camera: looking almost straight down on Lower Manhattan, swaying a few
// degrees either side rather than orbiting, so the composition under the
// headline holds.
const CAMERA_TARGET = new THREE.Vector3(0, 40, -60)
const MAX_ELEVATION = 89.5

// Click pulses — must match MAX_PULSES in the vertex shader.
const MAX_PULSES = 4
const GROUND = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
// Clicks on these go to the element, not the scene.
const INTERACTIVE = 'a, button, input, textarea, select, label, [role="button"]'

export function LidarScene() {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef<EffectComposer | null>(null)
  const bloomRef = useRef<UnrealBloomPass | null>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const smoothPointer = useRef({ x: 0, y: 0 })
  const passRef = useRef(0)
  const elapsedRef = useRef(0)
  const [geometry, setGeometry] = useState<CloudGeometry | null>(null)
  // Only ever upgrades: a portrait load stretched to landscape would show the
  // culled edges, but shrinking a wide cloud costs nothing visible.
  const [tier, setTier] = useState<Tier>(() => tierFor(size.width, size.height))

  const params = useRef({
    colorMode: COLOR_MODES.Height,
    rampLow: '#2b5d09',
    rampMid: '#ffea28',
    rampHigh: '#f4fff9',
    heightMax: 320,
    sweepMode: SWEEP_MODES.Linear,
    sweepAngle: 0,
    sweepSeconds: 9,
    decay: 14,
    persist: 0.03,
    flash: 0.5,
    flashWidth: 0.003,
    pointSize: 0.7,
    edgeFade: 0.4,
    pulseSpeed: 150,
    pulseWidth: 7,
    pulseLife: 1.6,
    bloomStrength: 0.5,
    bloomRadius: 0.4,
    bloomThreshold: 0.55,
    exposure: 1.0,
    distance: 942,
    elevation: 89,
    sway: 9,
    swaySeconds: 50,
  })

  const material = useMemo(() => {
    const p = params.current
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uPass: { value: 0 },
        uMargin: { value: 0.08 },
        uSweepMode: { value: p.sweepMode },
        uSweepDir: { value: new THREE.Vector2(1, 0) },
        uSweepMin: { value: -700 },
        uSweepRange: { value: 1400 },
        uDecay: { value: p.decay },
        uPersist: { value: p.persist },
        uFlash: { value: p.flash },
        uFlashWidth: { value: p.flashWidth },
        uColorMode: { value: p.colorMode },
        uRampLow: { value: new THREE.Color(p.rampLow) },
        uRampMid: { value: new THREE.Color(p.rampMid) },
        uRampHigh: { value: new THREE.Color(p.rampHigh) },
        uHeightMax: { value: p.heightMax },
        uSize: { value: p.pointSize },
        uEdgeRadius: { value: 700 },
        uEdgeFade: { value: p.edgeFade },
        uScale: { value: 1 },
        uTime: { value: 0 },
        uPulses: {
          value: Array.from({ length: MAX_PULSES }, () => new THREE.Vector4(0, 0, -1e6, 0)),
        },
        uPulseSpeed: { value: p.pulseSpeed },
        uPulseWidth: { value: p.pulseWidth },
        uPulseLife: { value: p.pulseLife },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  useEffect(() => {
    if (tier === 'portrait' && tierFor(size.width, size.height) === 'wide') setTier('wide')
  }, [tier, size.width, size.height])

  useEffect(() => {
    const controller = new AbortController()
    loadLpc(CLOUDS[tier], controller.signal)
      .then((g) => {
        if (controller.signal.aborted) g.dispose()
        else setGeometry(g)
      })
      .catch((err) => {
        if (!controller.signal.aborted) console.error('[hero] failed to load point cloud', err)
      })
    return () => controller.abort()
  }, [tier])

  // Added imperatively rather than as <points>: the TanStack devtools plugin
  // stamps a data-tsd-source prop on every JSX element, and R3F throws trying
  // to apply it to a three object when the element re-renders.
  useEffect(() => {
    if (!geometry) return
    const points = new THREE.Points(geometry, material)
    points.frustumCulled = false
    scene.add(points)
    return () => {
      scene.remove(points)
      geometry.dispose()
    }
  }, [geometry, material, scene])
  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.near = 1
    cam.far = 20000
    cam.updateProjectionMatrix()
  }, [camera])

  useEffect(() => {
    const glr = gl as THREE.WebGLRenderer
    const composer = new EffectComposer(glr)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.5, 0.4, 0.55)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())
    composerRef.current = composer
    bloomRef.current = bloom
    return () => {
      composer.dispose()
      composerRef.current = null
      bloomRef.current = null
    }
    // size is read once for the initial bloom buffer; resizes go below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera])

  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio, 2)
    composerRef.current?.setPixelRatio(dpr)
    composerRef.current?.setSize(size.width, size.height)
    const cam = camera as THREE.PerspectiveCamera
    // Pixels per metre at unit distance, so uSize can be given in metres.
    material.uniforms.uScale.value =
      (size.height * dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)))
  }, [size.width, size.height, camera, material])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // The canvas sits behind the page with pointer events off, so listen on the
  // window and only react to clicks that land on the hero, off any control.
  useEffect(() => {
    const raycaster = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const hit = new THREE.Vector3()
    let next = 0

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target?.closest('[data-hero]') || target.closest(INTERACTIVE)) return
      // Selecting heading text shouldn't fire a ping.
      if (window.getSelection()?.toString()) return

      const rect = gl.domElement.getBoundingClientRect()
      ndc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      )
      raycaster.setFromCamera(ndc, camera)
      if (!raycaster.ray.intersectPlane(GROUND, hit)) return

      const slot = (material.uniforms.uPulses.value as THREE.Vector4[])[next]
      slot.set(hit.x, hit.z, elapsedRef.current, 1)
      next = (next + 1) % MAX_PULSES
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [gl, camera, material])

  useEffect(() => {
    // Hidden by default; add ?gui to the URL in dev to bring the panel back.
    if (!import.meta.env.DEV || !new URLSearchParams(window.location.search).has('gui')) return
    let gui: GUI | null = null
    let disposed = false

    import('lil-gui').then(({ default: GUIClass }) => {
      if (disposed) return
      gui = new GUIClass({ title: 'LiDAR Controls' })
      const p = params.current
      const u = material.uniforms

      const look = gui.addFolder('Colour')
      look.add(p, 'colorMode', COLOR_MODES).name('Colour by')
      look.addColor(p, 'rampLow').name('Low').onChange((v: string) => u.uRampLow.value.set(v))
      look.addColor(p, 'rampMid').name('Mid').onChange((v: string) => u.uRampMid.value.set(v))
      look.addColor(p, 'rampHigh').name('High').onChange((v: string) => u.uRampHigh.value.set(v))
      look.add(p, 'heightMax', 50, 550, 1).name('Height span (m)')
      look.add(p, 'pointSize', 0.2, 4, 0.01).name('Point size (m)')
      look.add(p, 'exposure', 0.2, 3, 0.01).name('Exposure')
      look.add(p, 'edgeFade', 0, 1, 0.01).name('Edge fade')

      const sweep = gui.addFolder('Scan')
      sweep.add(p, 'sweepMode', SWEEP_MODES).name('Sweep')
      sweep.add(p, 'sweepAngle', 0, 360, 1).name('Direction °')
      sweep.add(p, 'sweepSeconds', 2, 40, 0.1).name('Seconds / pass')
      sweep.add(p, 'decay', 0.5, 40, 0.1).name('Cool-down')
      sweep.add(p, 'persist', 0, 0.6, 0.005).name('Afterglow')
      sweep.add(p, 'flash', 0, 6, 0.01).name('Flash')
      sweep.add(p, 'flashWidth', 0.0005, 0.05, 0.0005).name('Flash width')

      const pulse = gui.addFolder('Click pulse')
      pulse.add(p, 'pulseSpeed', 20, 600, 1).name('Speed (m/s)')
      pulse.add(p, 'pulseWidth', 1, 40, 0.1).name('Width (m)')
      pulse.add(p, 'pulseLife', 0.3, 20, 0.1).name('Life (s)')

      const bloom = gui.addFolder('Bloom')
      bloom.add(p, 'bloomStrength', 0, 3, 0.01).name('Strength')
      bloom.add(p, 'bloomRadius', 0, 1, 0.01).name('Radius')
      bloom.add(p, 'bloomThreshold', 0, 1, 0.01).name('Threshold')

      const cam = gui.addFolder('Camera')
      cam.add(p, 'distance', 300, 3000, 1).name('Distance (m)')
      cam.add(p, 'elevation', 5, MAX_ELEVATION, 0.1).name('Elevation °')
      cam.add(p, 'sway', 0, 45, 0.1).name('Sway °')
      cam.add(p, 'swaySeconds', 5, 180, 1).name('Sway period (s)')
      cam.close()
    })

    return () => {
      disposed = true
      gui?.destroy()
    }
  }, [material])

  useFrame((state, delta) => {
    const composer = composerRef.current
    if (!composer) return
    const p = params.current
    const u = material.uniforms

    elapsedRef.current += delta
    u.uTime.value = elapsedRef.current
    // Hold the scan until the cloud is on screen so the first pass is seen.
    const portrait = state.size.width < state.size.height
    const sweepSeconds = p.sweepSeconds * (portrait ? PORTRAIT_SWEEP_SCALE : 1)
    if (geometry) passRef.current += delta / sweepSeconds

    // Sweep geometry: project the cloud's footprint onto the sweep direction.
    const a = THREE.MathUtils.degToRad(p.sweepAngle)
    const dir = u.uSweepDir.value as THREE.Vector2
    dir.set(Math.cos(a), Math.sin(a))
    const box = geometry?.boundingBox
    if (box) {
      // Culled clouds no longer reach the crop's edge, so prefer the radius
      // recorded at build time over the bounds.
      u.uEdgeRadius.value =
        geometry.userData.header.cropRadius ??
        Math.min(-box.min.x, box.max.x, -box.min.z, box.max.z)
      if (p.sweepMode === SWEEP_MODES.Linear) {
        const corners = [
          box.min.x * dir.x + box.min.z * dir.y,
          box.max.x * dir.x + box.min.z * dir.y,
          box.min.x * dir.x + box.max.z * dir.y,
          box.max.x * dir.x + box.max.z * dir.y,
        ]
        const lo = Math.min(...corners)
        u.uSweepMin.value = lo
        u.uSweepRange.value = Math.max(...corners) - lo
      } else {
        u.uSweepRange.value = Math.hypot(
          Math.max(-box.min.x, box.max.x),
          Math.max(-box.min.z, box.max.z)
        )
      }
    }

    u.uPass.value = passRef.current
    u.uSweepMode.value = p.sweepMode
    u.uDecay.value = p.decay * (portrait ? PORTRAIT_DECAY_SCALE : 1)
    u.uPersist.value = p.persist
    u.uFlash.value = p.flash
    u.uFlashWidth.value = p.flashWidth
    u.uColorMode.value = p.colorMode
    u.uHeightMax.value = p.heightMax
    u.uSize.value = p.pointSize
    u.uEdgeFade.value = p.edgeFade
    u.uPulseSpeed.value = p.pulseSpeed
    u.uPulseWidth.value = p.pulseWidth
    u.uPulseLife.value = p.pulseLife

    const bloom = bloomRef.current
    if (bloom) {
      bloom.strength = p.bloomStrength
      bloom.radius = p.bloomRadius
      bloom.threshold = p.bloomThreshold
    }
    ;(gl as THREE.WebGLRenderer).toneMappingExposure = p.exposure

    // Camera: slow sway plus a little pointer parallax, eased.
    const ease = 1 - Math.exp(-delta * 2)
    smoothPointer.current.x += (pointer.current.x - smoothPointer.current.x) * ease
    smoothPointer.current.y += (pointer.current.y - smoothPointer.current.y) * ease
    const sway = Math.sin((elapsedRef.current / p.swaySeconds) * Math.PI * 2) * p.sway
    const azimuth = THREE.MathUtils.degToRad(sway + smoothPointer.current.x * 4)
    // Stop short of straight down: past 90° the camera tips over the top and
    // lookAt flips the whole frame. Near-vertical, azimuth reads as a slow
    // rotation of the map, which is what the sway becomes from up here.
    const elevation = THREE.MathUtils.degToRad(
      Math.min(p.elevation - smoothPointer.current.y * 3, MAX_ELEVATION)
    )
    camera.position.set(
      CAMERA_TARGET.x + p.distance * Math.cos(elevation) * Math.sin(azimuth),
      CAMERA_TARGET.y + p.distance * Math.sin(elevation),
      CAMERA_TARGET.z + p.distance * Math.cos(elevation) * Math.cos(azimuth)
    )
    camera.lookAt(CAMERA_TARGET)

    composer.render()
  }, 1)

  return null
}

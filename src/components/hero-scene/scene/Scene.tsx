import { useRef, useEffect, useMemo } from 'react'
import type GUI from 'lil-gui'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js'
import { createGeoTexture } from './geoTexture'
import { usePageReady } from '@/hooks/usePageReady'
import globeVertexShader from '../shaders/globe/vertex.glsl'
import globeFragmentShader from '../shaders/globe/fragment.glsl'
import atmosphereFragmentShader from '../shaders/globe/atmosphereFragment.glsl'

const GLOBE_RADIUS = 1
// Land floats this far above the water so the two read as separate layers —
// visible as a sliver of parallax at the limb as the globe turns.
const LAND_LIFT = 0.012
const ATMOSPHERE_SCALE = 1.08
// Flutes around the equator. Each spans 360 / N degrees of longitude.
const FLUTE_COUNT = 56
// Film grain on the globe's surface (the background gets none).
const GRAIN = 0.08

// Share of the viewport the globe's diameter should fill. Height governs on
// landscape screens, width on portrait ones.
const FRAME_HEIGHT = 0.64
const FRAME_WIDTH = 0.86

// Lon -90 faces the camera at rest; start the spin on Florida instead.
const START_LONGITUDE = -82
const START_ROTATION = THREE.MathUtils.degToRad(-90 - START_LONGITUDE)
// Once the preloader lifts, the globe grows in while turning the last stretch
// eastward to land on START_LONGITUDE, then hands over to the steady spin.
const INTRO_DURATION = 2.6
const INTRO_TURN = 1.4
const INTRO_SCALE = 0.82
const AXIAL_TILT = THREE.MathUtils.degToRad(-23.4)
const PARALLAX = 0.12

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex)
  return new THREE.Vector3(c.r, c.g, c.b)
}

interface LayerParams {
  colorBase: string
  colorMid: string
  colorAccent: string
  scale: number
  frequency: number
  warp: number
  flow: number
  seed: number
  direction: number
}

function createLayerMaterial(
  layer: LayerParams,
  mask: THREE.Texture,
  isLand: boolean
) {
  return new THREE.ShaderMaterial({
    vertexShader: globeVertexShader,
    fragmentShader: globeFragmentShader,
    uniforms: {
      time: { value: 0 },
      uMask: { value: mask },
      uIsLand: { value: isLand ? 1 : 0 },
      uColorBase: { value: hexToVec3(layer.colorBase) },
      uColorMid: { value: hexToVec3(layer.colorMid) },
      uColorAccent: { value: hexToVec3(layer.colorAccent) },
      uScale: { value: layer.scale },
      uFrequency: { value: layer.frequency },
      uWarp: { value: layer.warp },
      uFlow: { value: layer.flow },
      uSeed: { value: layer.seed },
      uDirection: { value: layer.direction },
      uBorders: { value: 0 },
      uCoastShadow: { value: 0 },
      uShade: { value: 0 },
      uRim: { value: 0 },
      uLightDir: { value: new THREE.Vector3(-0.55, 0.45, 0.7).normalize() },
      uFluteCount: { value: FLUTE_COUNT },
      uFluteRefract: { value: 0 },
      uFluteDepth: { value: 0 },
      uFluteSpecular: { value: 0 },
      uGrain: { value: GRAIN },
    },
    transparent: isLand,
    // The land shell's coast fades out smoothly; letting it write depth would
    // punch those soft edges out of anything drawn after it.
    depthWrite: !isLand,
  })
}

export function Scene() {
  const { gl, scene, camera, size } = useThree()
  const timeRef = useRef(0)
  const composerRef = useRef<EffectComposer | null>(null)
  const globeRef = useRef<THREE.Group>(null)
  const spinRef = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const introRef = useRef(0)
  const spinAngleRef = useRef(0)
  // Hold the globe until the preloader is gone so nobody misses the intro.
  const pageReady = usePageReady()
  const pageReadyRef = useRef(pageReady)
  pageReadyRef.current = pageReady

  const params = useRef({
    speed: 1.0,
    spin: 0.05,
    landLift: LAND_LIFT,
    borders: 0.35,
    coastShadow: 0.45,
    shade: 0.6,
    rim: 0.6,
    atmosphere: 0.55,
    atmosphereColor: '#33caff',
    water: {
      colorBase: '#33caff',
      colorMid: '#0b3a7a',
      colorAccent: '#05080d',
      scale: 3.0,
      frequency: 35,
      warp: 1.8,
      flow: 0.15,
      seed: 0,
      // Currents run with the latitudes, across the grain of the glass.
      direction: Math.PI / 2,
    } as LayerParams,
    land: {
      colorBase: '#00ffbf',
      colorMid: '#247525',
      colorAccent: '#090d0a',
      scale: 4.0,
      frequency: 35,
      warp: 1.4,
      flow: 0.22,
      seed: 17.3,
      direction: 0,
    } as LayerParams,
    fluteCount: FLUTE_COUNT,
    fluteRefract: 0.6,
    fluteDepth: 0.65,
    fluteSpecular: 0.35,
  })

  const mask = useMemo(
    () => createGeoTexture('/map.json', gl.capabilities.getMaxAnisotropy()),
    [gl]
  )

  const { waterMaterial, landMaterial, atmosphereMaterial } = useMemo(() => {
    const p = params.current
    return {
      waterMaterial: createLayerMaterial(p.water, mask.texture, false),
      landMaterial: createLayerMaterial(p.land, mask.texture, true),
      atmosphereMaterial: new THREE.ShaderMaterial({
        vertexShader: globeVertexShader,
        fragmentShader: atmosphereFragmentShader,
        uniforms: {
          uColor: { value: hexToVec3(p.atmosphereColor) },
          uIntensity: { value: p.atmosphere },
        },
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    }
  }, [mask])

  useEffect(() => {
    return () => {
      mask.dispose()
      waterMaterial.dispose()
      landMaterial.dispose()
      atmosphereMaterial.dispose()
    }
  }, [mask, waterMaterial, landMaterial, atmosphereMaterial])

  useEffect(() => {
    const glr = gl as THREE.WebGLRenderer
    const composer = new EffectComposer(glr)
    composer.addPass(new RenderPass(scene, camera))

    // Grain now lives in the globe shader so the background stays clean. A
    // plain copy keeps the final blit to screen exactly as it was.
    composer.addPass(new ShaderPass(CopyShader))

    composerRef.current = composer

    return () => {
      composer.dispose()
      composerRef.current = null
    }
  }, [gl, scene, camera])

  useEffect(() => {
    const composer = composerRef.current
    if (composer) {
      composer.setSize(size.width, size.height)
      composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    // Back the camera off until the globe fits both frame constraints.
    const cam = camera as THREE.PerspectiveCamera
    const halfFov = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
    const aspect = size.width / size.height
    const byHeight = GLOBE_RADIUS / (FRAME_HEIGHT * halfFov)
    const byWidth = GLOBE_RADIUS / (FRAME_WIDTH * halfFov * aspect)
    cam.position.set(0, 0, Math.max(byHeight, byWidth))
    cam.lookAt(0, 0, 0)
  }, [size.width, size.height, camera])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    if (!import.meta.env.DEV) return

    let gui: GUI | null = null
    let disposed = false

    import('lil-gui').then(({ default: GUIClass }) => {
      if (disposed) return

      gui = new GUIClass({ title: 'Globe Controls' })
      const p = params.current

      gui.add(p, 'speed', 0, 3, 0.01).name('Fluid speed')
      gui.add(p, 'spin', -0.5, 0.5, 0.001).name('Spin')

      const addLayer = (
        title: string,
        layer: LayerParams,
        material: THREE.ShaderMaterial
      ) => {
        const folder = gui!.addFolder(title)
        const u = material.uniforms
        folder.addColor(layer, 'colorBase').name('Base')
          .onChange((v: string) => (u.uColorBase.value = hexToVec3(v)))
        folder.addColor(layer, 'colorMid').name('Mid')
          .onChange((v: string) => (u.uColorMid.value = hexToVec3(v)))
        folder.addColor(layer, 'colorAccent').name('Accent')
          .onChange((v: string) => (u.uColorAccent.value = hexToVec3(v)))
        folder.add(layer, 'scale', 0.5, 12, 0.01).name('Scale')
          .onChange((v: number) => (u.uScale.value = v))
        folder.add(layer, 'frequency', 5, 120, 0.1).name('Stripes')
          .onChange((v: number) => (u.uFrequency.value = v))
        folder.add(layer, 'warp', 0, 6, 0.01).name('Warp')
          .onChange((v: number) => (u.uWarp.value = v))
        folder.add(layer, 'flow', 0, 1, 0.001).name('Flow')
          .onChange((v: number) => (u.uFlow.value = v))
        folder.add(layer, 'seed', 0, 100, 0.1).name('Seed')
          .onChange((v: number) => (u.uSeed.value = v))
        folder.add(layer, 'direction', 0, Math.PI, 0.01).name('Direction')
          .onChange((v: number) => (u.uDirection.value = v))
        return folder
      }

      addLayer('Water', p.water, waterMaterial)
      const landFolder = addLayer('Land', p.land, landMaterial)
      landFolder.add(p, 'borders', 0, 1, 0.01).name('Borders')
      landFolder.add(p, 'landLift', 0, 0.08, 0.001).name('Lift')

      const lookFolder = gui.addFolder('Lighting')
      lookFolder.add(p, 'shade', 0, 1, 0.01).name('Night side')
      lookFolder.add(p, 'rim', 0, 2, 0.01).name('Rim')
      lookFolder.add(p, 'coastShadow', 0, 1, 0.01).name('Coast shadow')
      lookFolder.add(p, 'atmosphere', 0, 3, 0.01).name('Atmosphere')
      lookFolder.addColor(p, 'atmosphereColor').name('Atmosphere color')
        .onChange((v: string) => (atmosphereMaterial.uniforms.uColor.value = hexToVec3(v)))
      lookFolder.close()

      const glassFolder = gui.addFolder('Glass Flutes')
      glassFolder.add(p, 'fluteCount',    8, 160, 1).name('Count')
      glassFolder.add(p, 'fluteRefract',  0, 2,   0.01).name('Refraction')
      glassFolder.add(p, 'fluteDepth',    0, 1,   0.01).name('Valley shadow')
      glassFolder.add(p, 'fluteSpecular', 0, 2,   0.01).name('Specular')
      glassFolder.open()
    })

    return () => {
      disposed = true
      gui?.destroy()
    }
  }, [waterMaterial, landMaterial, atmosphereMaterial])

  useFrame((_, delta) => {
    const composer = composerRef.current
    const globe    = globeRef.current
    const spin     = spinRef.current
    if (!composer || !globe || !spin) return

    const p = params.current
    timeRef.current += p.speed * delta

    for (const mat of [waterMaterial, landMaterial]) {
      const u = mat.uniforms
      u.time.value         = timeRef.current
      u.uBorders.value     = p.borders
      u.uCoastShadow.value = p.coastShadow
      u.uShade.value       = p.shade
      u.uRim.value         = p.rim
      u.uFluteCount.value    = p.fluteCount
      u.uFluteRefract.value  = p.fluteRefract
      u.uFluteDepth.value    = p.fluteDepth
      u.uFluteSpecular.value = p.fluteSpecular
    }
    atmosphereMaterial.uniforms.uIntensity.value = p.atmosphere

    if (pageReadyRef.current && introRef.current < 1) {
      introRef.current = Math.min(1, introRef.current + delta / INTRO_DURATION)
    }
    const intro = 1 - Math.pow(1 - introRef.current, 3)
    // Ramp the steady spin in with the intro so the hand-off has no kink.
    spinAngleRef.current += p.spin * delta * introRef.current
    spin.rotation.y = START_ROTATION + spinAngleRef.current - INTRO_TURN * (1 - intro)
    globe.scale.setScalar(THREE.MathUtils.lerp(INTRO_SCALE, 1, intro))

    const landShell = spin.children[1]
    if (landShell) landShell.scale.setScalar(1 + p.landLift)

    // Ease towards the pointer so the globe leans a touch without ever
    // snapping when the cursor enters or leaves the window.
    const ease = 1 - Math.exp(-delta * 3)
    globe.rotation.x += (pointer.current.y * PARALLAX - globe.rotation.x) * ease
    globe.rotation.y += (pointer.current.x * PARALLAX - globe.rotation.y) * ease

    composer.render()
  }, 1)

  return (
    // Outer group: pointer parallax. Tilt group: Earth's axial tilt. Spin
    // group: rotation about the (tilted) polar axis.
    <group ref={globeRef}>
      <group rotation={[0, 0, AXIAL_TILT]}>
        <group
          ref={spinRef}
          rotation={[0, START_ROTATION - INTRO_TURN, 0]}
        >
          <mesh material={waterMaterial} renderOrder={0}>
            <sphereGeometry args={[GLOBE_RADIUS, 128, 64]} />
          </mesh>
          <mesh material={landMaterial} renderOrder={1}>
            <sphereGeometry args={[GLOBE_RADIUS, 128, 64]} />
          </mesh>
        </group>
        <mesh material={atmosphereMaterial} renderOrder={2}>
          <sphereGeometry args={[GLOBE_RADIUS * ATMOSPHERE_SCALE, 64, 32]} />
        </mesh>
      </group>
    </group>
  )
}

import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { DotScreenShader } from './DotScreenShader'
import { BlindShader } from './BlindShader'
import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'

const LARGE_SPHERE_RADIUS = 1.5

function hexToVec3(hex: string): THREE.Vector3 {
  const c = new THREE.Color(hex)
  return new THREE.Vector3(c.r, c.g, c.b)
}

export function Scene() {
  const { gl, scene, camera, size } = useThree()
  const timeRef = useRef(0)
  const composerRef = useRef<EffectComposer | null>(null)
  const largeMaterialRef = useRef<THREE.ShaderMaterial | null>(null)
  const blindPassRef = useRef<ShaderPass | null>(null)

  const params = useRef({
    speed: 1.0,
    colorBase: '#00ffbf',
    colorAccent: '#080d0a',
    colorMid: '#247525',
    cameraRotationX: 196,
    cameraRotationY: 187,
    cameraRotationZ: 311,
    blindScale:    20.0,
    blindAngle:    0.0,
    blindRefract:  0.5,
    blindSpecular: 0.0,
  })

  const largeUniforms = useMemo(
    () => ({
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uColorBase:   { value: hexToVec3('#00ffbf') },
      uColorAccent: { value: hexToVec3('#080d0a') },
      uColorMid:    { value: hexToVec3('#247525') },
    }),
    []
  )

  useEffect(() => {
    const glr = gl as THREE.WebGLRenderer
    const composer = new EffectComposer(glr)
    composer.addPass(new RenderPass(scene, camera))

    const dotPass = new ShaderPass(DotScreenShader)
    dotPass.uniforms['scale'].value = 4
    composer.addPass(dotPass)

    const blindPass = new ShaderPass(BlindShader)
    composer.addPass(blindPass)
    blindPassRef.current = blindPass

    composerRef.current = composer

    return () => {
      composer.dispose()
      composerRef.current = null
      blindPassRef.current = null
    }
  }, [gl, scene, camera])

  useEffect(() => {
    const composer = composerRef.current
    if (!composer) return
    composer.setSize(size.width, size.height)
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }, [size.width, size.height])


  useFrame((_, delta) => {
    const composer  = composerRef.current
    const largeMat  = largeMaterialRef.current
    const blindPass = blindPassRef.current

    if (!composer || !largeMat) return

    timeRef.current += params.current.speed * delta
    largeMat.uniforms.time.value = timeRef.current

    const toRad = (d: number) => (d * Math.PI) / 180
    camera.rotation.x = toRad(params.current.cameraRotationX)
    camera.rotation.y = toRad(params.current.cameraRotationY)
    camera.rotation.z = toRad(params.current.cameraRotationZ)

    if (blindPass) {
      blindPass.uniforms.uTime.value     = timeRef.current
      blindPass.uniforms.uScale.value    = params.current.blindScale
      blindPass.uniforms.uAngle.value    = params.current.blindAngle
      blindPass.uniforms.uRefract.value  = params.current.blindRefract
      blindPass.uniforms.uSpecular.value = params.current.blindSpecular
    }

    composer.render()
  }, 1)

  return (
    <>
      <mesh>
        <sphereGeometry args={[LARGE_SPHERE_RADIUS, 32, 32]} />
        <shaderMaterial
          ref={largeMaterialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={largeUniforms}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}

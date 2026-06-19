import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { DotScreenShader } from './DotScreenShader'
import vertexShader from '../shaders/vertex.glsl'
import fragmentShader from '../shaders/fragment.glsl'

const LARGE_SPHERE_RADIUS = 1.5

export function Scene() {
  const { gl, scene, camera, size } = useThree()
  const timeRef = useRef(0)
  const composerRef = useRef<EffectComposer | null>(null)
  const largeMaterialRef = useRef<THREE.ShaderMaterial | null>(null)

  const largeUniforms = useMemo(
    () => ({
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
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
    composerRef.current = composer

    return () => {
      composer.dispose()
      composerRef.current = null
    }
  }, [gl, scene, camera])

  useEffect(() => {
    const composer = composerRef.current
    if (!composer) return
    composer.setSize(size.width, size.height)
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }, [size.width, size.height])

  useFrame((_, delta) => {
    const composer = composerRef.current
    const largeMat = largeMaterialRef.current

    if (!composer || !largeMat) return

    // Scaled by delta so the animation speed no longer depends on the
    // device's actual frame rate.
    timeRef.current += 0.85 * delta
    largeMat.uniforms.time.value = timeRef.current

    // useFrame already runs on rAF; render directly to avoid nested frame loops.
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

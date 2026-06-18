"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import * as THREE from "three";
/**
 * Client-only wrapper for the R3F canvas.
 * R3F/WebGL cannot run during SSR, so we mount the canvas only after hydration.
 * Fills its parent when used inside a sized container (e.g. Hero).
 */
export function SceneCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full bg-[#eeeeee]" aria-hidden />
    );
  }

  return (
    <div className="h-full w-full">
      <Canvas
          frameloop="always"
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          camera={{
            position: [0, 0, 1.3],
            fov: 70,
            near: 0.001,
            far: 1000,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0xeeeeee, 1);
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.outputColorSpace = THREE.SRGBColorSpace;
            window.dispatchEvent(new Event("scene-ready"));
          }}
        >
          <Scene />
        </Canvas>
    </div>
  );
}

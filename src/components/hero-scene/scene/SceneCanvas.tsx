"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
// The globe lives on in ./Scene if we want to swap back.
import { LidarScene } from "./LidarScene";
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
      <div className="h-full w-full bg-surface-page" aria-hidden />
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
            // LidarScene drives the camera every frame; these are just its lens.
            position: [0, 400, 1250],
            fov: 35,
            near: 1,
            far: 20000,
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x050606, 1);
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            gl.outputColorSpace = THREE.SRGBColorSpace;
            window.dispatchEvent(new Event("scene-ready"));
          }}
        >
          <LidarScene />
        </Canvas>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import * as THREE from "three";

/**
 * Client-only wrapper for the R3F canvas.
 * R3F/WebGL cannot run during SSR, so we mount the canvas only after hydration.
 * @param height - Height of the canvas in px (e.g. 600). Parent can crop with overflow-hidden to show a "window" (e.g. 180px).
 */
export function SceneCanvas({ height = 600 }: { height?: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="w-full bg-[#eeeeee]"
        style={{ width: "100%", height: `${height}px` }}
        aria-hidden
      />
    );
  }

  return (
    <div className="h-48 overflow-hidden rounded-xl">
      <div className="" style={{ width: "100%", height: `${height}px` }}>
        <Canvas
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
          }}
        >
          <Scene />
        </Canvas>
      </div>
    </div>
  );
}

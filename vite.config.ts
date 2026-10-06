import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import tsconfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import glsl from "vite-plugin-glsl";

const config = defineConfig({
  server: {
    allowedHosts: [".ngrok-free.app"],
  },
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    nitro({
      preset: process.env.NITRO_PRESET || "vercel",
      routeRules: {
        // Point clouds carry a content hash in their filename
        // (scripts/lidar/pack_cloud.py), so a URL's bytes never change.
        "/lidar/**": {
          headers: { "cache-control": "public, max-age=31536000, immutable" },
        },
      },
    }),
    viteReact(),
    glsl(),
  ],
});

export default config;

import { c as createRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, u as useRouterState, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { x as xj } from "../_libs/hugeicons__core-free-icons.mjs";
import { C as Canvas, u as useThree, a as useFrame } from "../_libs/react-three__fiber.mjs";
import { c as SRGBColorSpace, j as Vector4, E as EffectComposer, k as RenderPass, l as ShaderPass, g as Vector2, D as DoubleSide, C as Color, f as Vector3 } from "../_libs/three.mjs";
import { g as gsapWithCSS } from "../_libs/gsap.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { H as HugeiconsIcon } from "../_libs/hugeicons__react.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/zustand.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/scheduler.mjs";
import "../_libs/its-fine.mjs";
import "../_libs/react-use-measure.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function usePageReady() {
  const [ready, setReady] = reactExports.useState(() => {
    if (typeof window === "undefined") return true;
    return window.location.pathname !== "/";
  });
  reactExports.useEffect(() => {
    if (ready) return;
    const handler = () => setReady(true);
    window.addEventListener("preloader-complete", handler);
    return () => window.removeEventListener("preloader-complete", handler);
  }, [ready]);
  return ready;
}
const EMAIL = "colemmorgann@gmail.com";
const RESUME_URL = "/ColeMorgan_Resume.pdf";
function Nav() {
  const [copied, setCopied] = reactExports.useState(false);
  const [scrolled, setScrolled] = reactExports.useState(false);
  const pageReady = usePageReady();
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.nav,
    {
      initial: { y: -32, opacity: 0 },
      animate: { y: pageReady ? 0 : -32, opacity: pageReady ? 1 : 0 },
      transition: { duration: 0.5, ease: "easeOut", delay: 0.6 },
      className: `pointer-events-none fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 sm:px-8 font-medium transition-[background-color,border-color,padding] duration-300 ${scrolled ? "bg-surface-page border-b border-border-default-dark py-3" : "pt-5"}`,
      style: { viewTransitionName: "main-nav" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "pointer-events-auto flex flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-white transition-colors leading-5", children: "Cole Morgan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleCopyEmail,
              className: "mt-0.5 flex w-fit cursor-pointer items-center gap-1 text-xs font-normal tracking-wide text-white/75 hover:text-white transition-colors",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(HugeiconsIcon, { icon: xj, size: 12, className: "shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative inline-block h-[1em] align-bottom", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute inset-0 transition-all duration-200 ${copied ? "-translate-y-0.5 opacity-0" : "translate-y-0 opacity-100"}`, children: EMAIL }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute inset-0 transition-all duration-200 ${copied ? "translate-y-0 opacity-100" : "translate-y-0.5 opacity-0"}`, children: "Copied!" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: copied ? "Copied!" : EMAIL })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "pointer-events-auto flex items-center gap-6 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/",
              activeProps: { className: "text-white" },
              inactiveProps: { className: "text-white/75 hover:text-white transition-colors" },
              children: "Home"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: RESUME_URL,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-white/60 hover:text-white transition-colors",
              children: "Resume"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://www.linkedin.com/in/cole-morgan-/",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-white/60 hover:text-white transition-colors",
              children: "LinkedIn"
            }
          ) })
        ] })
      ]
    }
  );
}
const DotScreenShader = {
  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: new Vector2(256, 256) },
    center: { value: new Vector2(0.5, 0.5) },
    angle: { value: 1.57 },
    scale: { value: 1 }
  },
  vertexShader: (
    /* glsl */
    `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  ),
  fragmentShader: (
    /* glsl */
    `
    uniform vec2 center;
    uniform float angle;
    uniform float scale;
    uniform vec2 tSize;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;

    float random(vec2 p) {
      vec2 k1 = vec2(
        23.14069263277926,
        2.665144142690225
      );
      return fract(cos(dot(p, k1)) * 12345.6789);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec2 uvrandom = vUv;
      uvrandom.y *= random(vec2(uvrandom.y, 0.4));
      color.rgb += random(uvrandom) * 0.080;
      gl_FragColor = color;
    }
  `
  )
};
const BlindShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    // passed through but NOT used to move the blinds
    uScale: { value: 20 },
    uAngle: { value: 0 },
    uRefract: { value: 0.5 },
    uSpecular: { value: 0 }
  },
  vertexShader: (
    /* glsl */
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  ),
  fragmentShader: (
    /* glsl */
    `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uScale;
    uniform float uAngle;
    uniform float uRefract;
    uniform float uSpecular;
    varying vec2 vUv;

    #define PI 3.14159265358979

    void main() {
      vec2 uv = vUv;

      // ── Rotate UV for diagonal blinds (completely static) ─────────────────
      vec2  p  = uv - 0.5;
      float ca = cos(uAngle), sa = sin(uAngle);
      // No warp, no time term — the blind geometry never moves.
      float rotX = (ca * p.x - sa * p.y) + 0.5;

      // ── Stripe coordinate within each blind (0 = left edge, 1 = right) ───
      float stripe  = fract(rotX * uScale);

      // ── Convex glass profile ──────────────────────────────────────────────
      // sin dome: 0 at edges (valley), 1 at center (ridge).
      // The slope is the surface normal driver for refraction.
      float profile = sin(stripe * PI);
      float slope   = cos(stripe * PI);

      // ── Refraction ────────────────────────────────────────────────────────
      // Each blind is a fixed glass cylinder. Light from the moving scene
      // beneath bends as it exits through the curved glass surface.
      // The slope tells us which direction the glass face is tilted.
      vec2 refractDir = vec2(ca * slope, sa * slope);
      vec2 rUv        = clamp(uv - refractDir * uRefract * 0.045, 0.0, 1.0);
      vec3 color      = texture2D(tDiffuse, rUv).rgb;

      // ── Shadow in the valleys ─────────────────────────────────────────────
      color *= mix(0.35, 1.0, profile);

      // ── Hard seam mask ────────────────────────────────────────────────────
      // At stripe ≈ 0 and ≈ 1 the refraction vectors on neighbouring blinds
      // point in opposite directions, sampling a bright slice of the scene and
      // creating white lines. Force those seam pixels to black.
      float seam = smoothstep(0.0, 0.09, stripe) * smoothstep(1.0, 0.91, stripe);
      color *= seam;

      // ── Very subtle edge sheen ─────────────────────────────────────────────
      float rim = smoothstep(0.92, 1.0, profile) * uSpecular;
      color += vec3(rim);

      // rgba(0,0,0,0.2) tint — dims the light coming through the glass
      color *= 0.8;

      gl_FragColor = vec4(color, 1.0);
    }
  `
  )
};
var vertex_default = "uniform float time;\nvarying vec2 vUv;\nvarying vec3 vPosition;\nuniform vec2 pixels;\nfloat PI = 3.141592653589793238;\nvoid main() {\n  vUv = uv;\n  vPosition = position;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}";
var fragment_default = "uniform float time;\nuniform float progress;\nuniform sampler2D texture1;\nuniform vec4 resolution;\nuniform vec3 uColorBase;\nuniform vec3 uColorAccent;\nuniform vec3 uColorMid;\nvarying vec2 vUv;\nvarying vec3 vPosition;\nfloat PI = 3.141592653589793238;\n\nfloat mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}\nvec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}\nvec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}\n\nfloat noise(vec3 p){\n    vec3 a = floor(p);\n    vec3 d = p - a;\n    d = d * d * (3.0 - 2.0 * d);\n\n    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);\n    vec4 k1 = perm(b.xyxy);\n    vec4 k2 = perm(k1.xyxy + b.zzww);\n\n    vec4 c = k2 + a.zzzz;\n    vec4 k3 = perm(c);\n    vec4 k4 = perm(c + 1.0);\n\n    vec4 o1 = fract(k3 * (1.0 / 41.0));\n    vec4 o2 = fract(k4 * (1.0 / 41.0));\n\n    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);\n    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);\n\n    return o4.y * d.y + o4.x * (1.0 - d.y);\n}\n\nfloat lines(vec2 uv, float offset){\n	return smoothstep(\n		0., 0.5 + offset*0.5,\n		0.5*abs((sin(uv.x*35.) + offset*2.))\n	);\n}\n\nmat2 rotate2D(float angle){\n	return mat2(\n		cos(angle),-sin(angle),\n		sin(angle),cos(angle)\n	);\n}\n\nvoid main()	{\n\n	float n = noise(vPosition + time * 0.2);\n\n	vec2 baseUV = rotate2D(n)*vPosition.xy*0.1;\n	float basePattern = lines(baseUV, 0.5);\n	float secondPattern = lines(baseUV, 0.1);\n\n	vec3 baseColor = mix(uColorMid, uColorBase, basePattern);\n	vec3 secondBaseColor = mix(baseColor, uColorAccent, secondPattern);\n\n	\n	gl_FragColor = vec4(vec3(secondBaseColor),1.);\n}";
const LARGE_SPHERE_RADIUS = 1.5;
function hexToVec3(hex) {
  const c = new Color(hex);
  return new Vector3(c.r, c.g, c.b);
}
function Scene() {
  const { gl, scene, camera, size } = useThree();
  const timeRef = reactExports.useRef(0);
  const composerRef = reactExports.useRef(null);
  const largeMaterialRef = reactExports.useRef(null);
  const blindPassRef = reactExports.useRef(null);
  const params = reactExports.useRef({
    speed: 1,
    colorBase: "#00ffbf",
    colorAccent: "#080d0a",
    colorMid: "#247525",
    cameraRotationX: 196,
    cameraRotationY: 187,
    cameraRotationZ: 311,
    blindScale: 20,
    blindAngle: 0,
    blindRefract: 0.5,
    blindSpecular: 0
  });
  const largeUniforms = reactExports.useMemo(
    () => ({
      time: { value: 0 },
      resolution: { value: new Vector4() },
      uColorBase: { value: hexToVec3("#00ffbf") },
      uColorAccent: { value: hexToVec3("#080d0a") },
      uColorMid: { value: hexToVec3("#247525") }
    }),
    []
  );
  reactExports.useEffect(() => {
    const glr = gl;
    const composer = new EffectComposer(glr);
    composer.addPass(new RenderPass(scene, camera));
    const dotPass = new ShaderPass(DotScreenShader);
    dotPass.uniforms["scale"].value = 4;
    composer.addPass(dotPass);
    const blindPass = new ShaderPass(BlindShader);
    composer.addPass(blindPass);
    blindPassRef.current = blindPass;
    composerRef.current = composer;
    return () => {
      composer.dispose();
      composerRef.current = null;
      blindPassRef.current = null;
    };
  }, [gl, scene, camera]);
  reactExports.useEffect(() => {
    const composer = composerRef.current;
    if (!composer) return;
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [size.width, size.height]);
  useFrame((_, delta) => {
    const composer = composerRef.current;
    const largeMat = largeMaterialRef.current;
    const blindPass = blindPassRef.current;
    if (!composer || !largeMat) return;
    timeRef.current += params.current.speed * delta;
    largeMat.uniforms.time.value = timeRef.current;
    const toRad = (d) => d * Math.PI / 180;
    camera.rotation.x = toRad(params.current.cameraRotationX);
    camera.rotation.y = toRad(params.current.cameraRotationY);
    camera.rotation.z = toRad(params.current.cameraRotationZ);
    if (blindPass) {
      blindPass.uniforms.uTime.value = timeRef.current;
      blindPass.uniforms.uScale.value = params.current.blindScale;
      blindPass.uniforms.uAngle.value = params.current.blindAngle;
      blindPass.uniforms.uRefract.value = params.current.blindRefract;
      blindPass.uniforms.uSpecular.value = params.current.blindSpecular;
    }
    composer.render();
  }, 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("mesh", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("sphereGeometry", { args: [LARGE_SPHERE_RADIUS, 32, 32] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "shaderMaterial",
      {
        ref: largeMaterialRef,
        vertexShader: vertex_default,
        fragmentShader: fragment_default,
        uniforms: largeUniforms,
        side: DoubleSide
      }
    )
  ] }) });
}
function SceneCanvas() {
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full bg-[#080d0a]", "aria-hidden": true });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Canvas,
    {
      frameloop: "always",
      gl: {
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      },
      camera: {
        position: [0, 0, 1.3],
        fov: 70,
        near: 1e-3,
        far: 1e3
      },
      onCreated: ({ gl }) => {
        gl.setClearColor(527626, 1);
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        gl.outputColorSpace = SRGBColorSpace;
        window.dispatchEvent(new Event("scene-ready"));
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scene, {})
    }
  ) });
}
function FixedWebGLBackground() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 z-0", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SceneCanvas, {}) });
}
function PreloaderContent({ contentRef }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: contentRef,
      className: "absolute inset-0 z-3 flex items-center justify-center pointer-events-none opacity-0",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/favicon.svg", alt: "", className: "w-10 h-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white text-3xl font-medium tracking-[-0.01em]", children: "Cole Morgan" })
      ] })
    }
  );
}
const COLS = 14;
const ROWS = 10;
const TILE_DURATION = 0.18;
const TILE_STAGGER = 5e-3;
const BASE_DELAY = 0.15;
function Preloader() {
  const containerRef = reactExports.useRef(null);
  const contentRef = reactExports.useRef(null);
  const counterDoneRef = reactExports.useRef(false);
  const exitStartedRef = reactExports.useRef(false);
  const sceneReadyRef = reactExports.useRef(false);
  const startExitRef = reactExports.useRef(null);
  const preventScrollRef = reactExports.useRef(null);
  const preventKeysRef = reactExports.useRef(null);
  reactExports.useLayoutEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    const preventKeys = (e) => {
      const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
      if (keys.includes(e.key)) e.preventDefault();
    };
    preventScrollRef.current = preventScroll;
    preventKeysRef.current = preventKeys;
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeys);
    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);
    };
  }, []);
  reactExports.useLayoutEffect(() => {
    const container = containerRef.current;
    const contentEl = contentRef.current;
    if (!container || !contentEl) return;
    const tweens = [];
    tweens.push(gsapWithCSS.to(contentEl, { opacity: 1, duration: 0.3, ease: "power2.out", delay: 0.1 }));
    const runExit = () => {
      if (exitStartedRef.current) return;
      exitStartedRef.current = true;
      if (preventScrollRef.current) {
        window.removeEventListener("wheel", preventScrollRef.current);
        window.removeEventListener("touchmove", preventScrollRef.current);
        preventScrollRef.current = null;
      }
      if (preventKeysRef.current) {
        window.removeEventListener("keydown", preventKeysRef.current);
        preventKeysRef.current = null;
      }
      window.dispatchEvent(new Event("preloader-complete"));
      tweens.push(gsapWithCSS.to(contentEl, { opacity: 0, duration: 0.3, ease: "power2.in" }));
      const tiles = Array.from(container.querySelectorAll(".preloader-tile"));
      const shuffled = [...tiles].sort(() => Math.random() - 0.5);
      shuffled.forEach((tile, i) => {
        tweens.push(
          gsapWithCSS.to(tile, {
            opacity: 0,
            duration: TILE_DURATION,
            ease: "power2.in",
            delay: BASE_DELAY + i * TILE_STAGGER
          })
        );
      });
      const totalMs = (BASE_DELAY + (tiles.length - 1) * TILE_STAGGER + TILE_DURATION + 0.1) * 1e3;
      setTimeout(() => {
        container.style.visibility = "hidden";
        container.style.pointerEvents = "none";
        document.body.style.backgroundColor = "";
      }, totalMs);
    };
    startExitRef.current = runExit;
    const timer = gsapWithCSS.delayedCall(1.9, () => {
      counterDoneRef.current = true;
      if (sceneReadyRef.current) runExit();
    });
    tweens.push(timer);
    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);
  reactExports.useEffect(() => {
    const handler = () => {
      sceneReadyRef.current = true;
      if (counterDoneRef.current && startExitRef.current) {
        startExitRef.current();
      }
    };
    window.addEventListener("scene-ready", handler);
    return () => window.removeEventListener("scene-ready", handler);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      style: { position: "fixed", inset: 0, zIndex: 99999, pointerEvents: "all" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PreloaderContent, { contentRef }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`
            },
            children: Array.from({ length: COLS * ROWS }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preloader-tile", style: { backgroundColor: "#080d0a" } }, i))
          }
        )
      ]
    }
  );
}
function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    pathname === "/" && /* @__PURE__ */ jsxRuntimeExports.jsx(Preloader, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FixedWebGLBackground, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
const Route$1 = createRootRoute({
  component: RootLayout,
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "Cole Morgan | Software Engineer"
      },
      {
        name: "description",
        content: "Cole Morgan is a Software Engineer building geospatial tools and ML platforms. Explore his work, experience, and technical projects."
      },
      {
        property: "og:type",
        content: "website"
      },
      {
        property: "og:url",
        content: "https://colemorgan.me/"
      },
      {
        property: "og:title",
        content: "Cole Morgan | Software Engineer"
      },
      {
        property: "og:description",
        content: "Cole Morgan is a Software Engineer building geospatial tools and ML platforms. Explore his work, experience, and technical projects."
      },
      {
        property: "og:image",
        content: "https://colemorgan.me/project-mockups/wizlite.png"
      },
      {
        name: "twitter:card",
        content: "summary_large_image"
      },
      {
        name: "twitter:title",
        content: "Cole Morgan | Software Engineer"
      },
      {
        name: "twitter:description",
        content: "Cole Morgan is a Software Engineer building geospatial tools and ML platforms. Explore his work, experience, and technical projects."
      },
      {
        name: "twitter:image",
        content: "https://colemorgan.me/project-mockups/wizlite.png"
      }
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/icons/circle.svg"
      },
      {
        rel: "canonical",
        href: "https://colemorgan.me/"
      }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("link", { href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap", rel: "stylesheet" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { style: { backgroundColor: "#080d0a" }, children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter = () => import("./index-CA_CYrOA.mjs");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$1
});
const rootRouteChildren = {
  IndexRoute
};
const routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultViewTransition: true
  });
  return router2;
}
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  router,
  usePageReady
};

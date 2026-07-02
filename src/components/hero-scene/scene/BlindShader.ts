export const BlindShader = {
  uniforms: {
    tDiffuse:  { value: null as THREE.Texture | null },
    uTime:     { value: 0 },   // passed through but NOT used to move the blinds
    uScale:    { value: 20.0 },
    uAngle:    { value: 0.0 },
    uRefract:  { value: 0.5 },
    uSpecular: { value: 0.0 },
  },

  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */`
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
  `,
}

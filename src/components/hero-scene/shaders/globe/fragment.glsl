#define PI 3.141592653589793

// One shader, two layers. The water sphere renders opaque; the land shell sits
// just above it and keeps only the pixels the GeoJSON mask marks as land.
// Each layer brings its own palette and its own current, so the two fluids
// move independently.

uniform float time;
uniform sampler2D uMask;     // R = land, G = borders
uniform float uIsLand;       // 0 = water layer, 1 = land layer

uniform vec3 uColorBase;
uniform vec3 uColorMid;
uniform vec3 uColorAccent;

uniform float uScale;        // size of the fluid field on the sphere
uniform float uFrequency;    // stripe density
uniform float uWarp;         // how hard the noise twists the stripes
uniform float uFlow;         // how fast the noise drifts
uniform float uSeed;         // decorrelates the two layers
uniform float uDirection;    // stripe orientation, radians

uniform float uBorders;      // country border intensity (land only)
uniform float uCoastShadow;  // land casting onto the water below (water only)
uniform float uShade;        // day/night falloff
uniform float uRim;          // fresnel rim in the base colour
uniform vec3  uLightDir;     // view space

// Fluted glass wrapped around the globe: one ridge per flute, running pole to
// pole along the meridians. Both layers share it, so the flutes line up.
uniform float uFluteCount;
uniform float uFluteRefract; // how far each flute bends what is beneath it
uniform float uFluteDepth;   // shadow in the valleys between flutes
uniform float uFluteSpecular;
uniform float uGrain;        // film grain, in screen space

varying vec2 vUv;
varying vec3 vSurface;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vViewPosition;

// NOISE
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
  vec3 a = floor(p);
  vec3 d = p - a;
  d = d * d * (3.0 - 2.0 * d);

  vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
  vec4 k1 = perm(b.xyxy);
  vec4 k2 = perm(k1.xyxy + b.zzww);

  vec4 c = k2 + a.zzzz;
  vec4 k3 = perm(c);
  vec4 k4 = perm(c + 1.0);

  vec4 o1 = fract(k3 * (1.0 / 41.0));
  vec4 o2 = fract(k4 * (1.0 / 41.0));

  vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
  vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

  return o4.y * d.y + o4.x * (1.0 - d.y);
}

float lines(vec2 uv, float offset){
  return smoothstep(
    0., 0.5 + offset*0.5,
    0.5*abs((sin(uv.x*uFrequency) + offset*2.))
  );
}

float random(vec2 p) {
  vec2 k1 = vec2(
    23.14069263277926,
    2.665144142690225
  );
  return fract(cos(dot(p, k1)) * 12345.6789);
}

mat2 rotate2D(float angle){
  return mat2(
    cos(angle),-sin(angle),
    sin(angle),cos(angle)
  );
}

vec3 fluid(vec3 p) {
  float n = noise(p + uSeed + time * uFlow);

  vec2 baseUV = rotate2D(n * uWarp + uDirection) * p.xy * 0.1;
  float basePattern = lines(baseUV, 0.5);
  float secondPattern = lines(baseUV, 0.1);

  vec3 baseColor = mix(uColorMid, uColorBase, basePattern);
  return mix(baseColor, uColorAccent, secondPattern);
}

void main() {
  // -- Glass ----------------------------------------------------------------
  float flutes = vUv.x * uFluteCount;
  float stripe = fract(flutes);
  // Flutes converge at the poles and foreshorten at the limb; once one is only
  // a pixel or two wide it can only alias, so the glass fades out there.
  float glass = 1.0 - smoothstep(0.15, 0.45, fwidth(flutes));

  // sin dome: 0 in the valleys, 1 on the ridge. Its slope is the tilt of the
  // glass face and drives both the refraction and the highlight.
  float profile = sin(stripe * PI);
  float slope = cos(stripe * PI) * glass;

  // Refract by sliding the lookup east/west under each flute. The surface
  // point is rebuilt from the shifted UV so the fluid and the coastlines bend
  // together, exactly as if both sat beneath the same pane.
  vec2 refractedUv = vec2(vUv.x - slope * uFluteRefract / uFluteCount, vUv.y);
  float lon = refractedUv.x * 2.0 * PI;
  float ring = sqrt(max(0.0, 1.0 - vSurface.y * vSurface.y));
  vec3 surface = vec3(-cos(lon) * ring, vSurface.y, sin(lon) * ring);

  // -- Layers ---------------------------------------------------------------
  vec4 mask = texture2D(uMask, refractedUv);
  float land = smoothstep(0.35, 0.65, mask.r);

  float alpha = 1.0;
  if (uIsLand > 0.5) {
    alpha = land;
    if (alpha < 0.01) discard;
  }

  vec3 color = fluid(surface * uScale);

  if (uIsLand > 0.5) {
    // A dark lip right at the coast so the land reads as a layer sitting on
    // top of the water rather than a recoloured patch of it.
    float lip = 1.0 - smoothstep(0.0, 0.6, abs(land - 0.5) * 2.0);
    color *= 1.0 - lip * 0.75;
    color = mix(color, uColorBase * 1.3, mask.g * uBorders);
  } else {
    // A heavily blurred read of the land mask is a cheap stand-in for the
    // shadow the raised land layer throws onto the water.
    float nearLand = texture2D(uMask, refractedUv, 4.0).r;
    color *= 1.0 - nearLand * uCoastShadow;
  }

  // Valley shadow, then a hard dark seam where neighbouring flutes meet -
  // their refraction points in opposite directions there and would otherwise
  // tear a bright line out of the pattern.
  float seam = smoothstep(0.0, 0.09, stripe) * smoothstep(1.0, 0.91, stripe);
  color *= mix(1.0, mix(1.0 - uFluteDepth, 1.0, profile) * seam, glass);

  // -- Lighting -------------------------------------------------------------
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(-vViewPosition);
  float facing = clamp(dot(normal, viewDir), 0.0, 1.0);

  // Tip the normal across each flute so every ridge catches its own light.
  float tangentLength = length(vTangent);
  vec3 tangent = tangentLength > 1e-4 ? vTangent / tangentLength : vec3(0.0);
  vec3 glassNormal = normalize(normal + tangent * slope * 0.9);

  vec3 lightDir = normalize(uLightDir);
  // Half-lambert keeps the night side readable instead of crushing to black.
  float light = dot(normal, lightDir) * 0.5 + 0.5;
  color *= mix(1.0 - uShade, 1.0, light);

  float spec = pow(max(dot(glassNormal, normalize(lightDir + viewDir)), 0.0), 48.0);
  color += mix(vec3(1.0), uColorBase, 0.5) * spec * uFluteSpecular * glass;

  float rim = pow(1.0 - facing, 3.0);
  color += uColorBase * rim * uRim;

  // Same grain the old full-screen pass laid down, now only on the globe.
  // Keyed to the pixel, not the surface, so it stays put as the globe turns.
  vec2 grainUv = gl_FragCoord.xy * 0.001;
  grainUv.y *= random(vec2(grainUv.y, 0.4));
  color += random(grainUv) * uGrain;

  gl_FragColor = vec4(color, alpha);
}

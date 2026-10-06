// A scan front sweeps through the cloud. Points it has just crossed flash
// white, cool into the colour ramp, then settle to a dim afterglow that lasts
// until the next pass. Everything is derived from the pass clock, so no
// per-point state ever lives on the CPU.

attribute float aIntensity;  // 0..1

uniform float uPass;         // passes completed, fractional
uniform float uMargin;       // run-up either side of the cloud, in sweep units
uniform int   uSweepMode;    // 0 linear, 1 radial
uniform vec2  uSweepDir;     // linear: unit direction across the ground plane
uniform float uSweepMin;     // linear: projection of the cloud's near edge
uniform float uSweepRange;   // linear: projected width / radial: max radius

uniform float uDecay;        // how fast a hit cools back to the afterglow
uniform float uPersist;      // afterglow level, 0..1
uniform float uFlash;        // white-hot strength at the front
uniform float uFlashWidth;   // thickness of the white band, in sweep units

uniform int   uColorMode;    // 0 height, 1 intensity
uniform vec3  uRampLow;
uniform vec3  uRampMid;
uniform vec3  uRampHigh;
uniform float uHeightMax;

uniform float uEdgeRadius;   // the crop's half-width, metres
uniform float uEdgeFade;     // share of that radius spent fading out

// Click pulses: rings that expand across the ground from where you clicked.
#define MAX_PULSES 4
uniform vec4  uPulses[MAX_PULSES]; // x, z centre (metres), start time, strength
uniform float uTime;
uniform float uPulseSpeed;   // metres per second
uniform float uPulseWidth;   // ring thickness, metres
uniform float uPulseLife;    // seconds until a ring has faded out

uniform float uSize;         // point diameter, metres
uniform float uScale;        // pixels per metre at unit distance

varying vec3  vColor;
varying float vAlpha;

vec3 ramp(float t) {
  return t < 0.5
    ? mix(uRampLow, uRampMid, t * 2.0)
    : mix(uRampMid, uRampHigh, (t - 0.5) * 2.0);
}

void main() {
  // -- Where this point sits along the sweep, 0 at the start, 1 at the end --
  float s = uSweepMode == 0
    ? (dot(position.xz, uSweepDir) - uSweepMin) / uSweepRange
    : length(position.xz) / uSweepRange;

  float cycle = 1.0 + uMargin * 2.0;
  float front = fract(uPass) * cycle - uMargin;
  float age = front - s;
  float scanned = 1.0;
  if (age < 0.0) {
    // Not reached yet this pass, so its last hit was the previous pass —
    // unless there hasn't been one.
    age += cycle;
    scanned = step(1.0, uPass);
  }

  float energy = exp(-age * uDecay);
  float flash = exp(-age / max(uFlashWidth, 1e-4));
  float brightness = scanned * (uPersist + (1.0 - uPersist) * energy);

  // -- Click pulses -----------------------------------------------------------
  // Lights points regardless of the scan, so a ping works mid-first-pass too.
  float pulse = 0.0;
  for (int i = 0; i < MAX_PULSES; i++) {
    vec4 p = uPulses[i];
    float pulseAge = uTime - p.z;
    if (pulseAge < 0.0 || pulseAge > uPulseLife) continue;
    float radius = pulseAge * uPulseSpeed;
    float d = distance(position.xz, p.xy);
    float ring = exp(-pow((d - radius) / uPulseWidth, 2.0));
    // A faint wake inside the ring so it reads as a wave, not a wire.
    float wake = d < radius ? 0.3 * exp(-(radius - d) / (uPulseWidth * 5.0)) : 0.0;
    float life = 1.0 - pulseAge / uPulseLife;
    pulse = max(pulse, (ring + wake) * life * life * p.w);
  }
  brightness = max(brightness, pulse);
  float hot = max(flash * scanned, pulse);

  // Dissolve the square crop into a soft disc so no hard edge gives away
  // where the data was cut.
  float r = length(position.xz) / uEdgeRadius;
  brightness *= 1.0 - smoothstep(1.0 - uEdgeFade, 1.0, r);

  // -- Colour ---------------------------------------------------------------
  vec3 base = uColorMode == 0
    ? ramp(pow(clamp(position.y / uHeightMax, 0.0, 1.0), 0.55))
    : ramp(aIntensity);

  vColor = mix(base, vec3(1.0), hot * 0.85) * (1.0 + hot * uFlash);
  vAlpha = brightness;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  // Freshly hit points swell slightly, as if the return is still ringing.
  gl_PointSize = max(1.0, uSize * uScale / -mvPosition.z * (1.0 + hot * 0.8));
  if (brightness < 0.003) gl_PointSize = 0.0;
}

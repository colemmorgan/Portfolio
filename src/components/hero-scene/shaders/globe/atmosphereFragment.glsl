// Rendered on the back faces of a slightly larger sphere, so it only shows as
// a halo around the silhouette — this is what the glass blinds catch and smear
// out past the edge of the globe.

uniform vec3 uColor;
uniform float uIntensity;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(-vViewPosition);

  // Back faces point away from the camera, so this is ~0 at the limb of the
  // halo and grows towards the globe's edge (where it tops out around 0.5 —
  // anything further in is hidden behind the globe).
  float glow = pow(clamp(-dot(normal, viewDir) * 2.0, 0.0, 1.0), 2.0);

  gl_FragColor = vec4(uColor * glow * uIntensity, 1.0);
}

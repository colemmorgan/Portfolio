varying vec2 vUv;
varying vec3 vSurface;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vViewPosition;

void main() {
  vUv = uv;
  // Unit-sphere position in object space: the fluid is painted onto the globe
  // and turns with it, and both layers share coordinates whatever their radius.
  vSurface = normalize(position);
  vNormal = normalize(normalMatrix * normal);
  // Points east, across the glass flutes. Left unnormalised: it collapses to
  // zero at the poles, and the fragment shader treats that as "no tilt".
  vTangent = normalMatrix * cross(vec3(0.0, 1.0, 0.0), normal);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}

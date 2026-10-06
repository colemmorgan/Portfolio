varying vec3  vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;

  // Soft disc: the cloud blends additively, so a feathered edge keeps dense
  // facades glowing instead of clipping into flat white slabs.
  float falloff = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, vAlpha * falloff);
}

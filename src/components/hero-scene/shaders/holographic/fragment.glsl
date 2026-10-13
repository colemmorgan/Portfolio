uniform vec3 uColor;
uniform float uTime;
uniform sampler2D uMap;
uniform float uBorders;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main()
{
    // Normal
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing)
        normal *= - 1.0;

    // Stripes
    float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    // Fresnel
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    // Falloff
    float falloff = smoothstep(0.8, 0.2, fresnel);

    // Holographic
    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25;
    holographic *= falloff;

    // Country boundaries, sampled from the equirectangular GeoJSON mask.
    // Multiplied by the same falloff as everything else so the coastlines
    // disappear into the silhouette instead of outlining a hard edge.
    float borders = texture2D(uMap, vUv).r;
    holographic += borders * uBorders * falloff;

    // Final color
    gl_FragColor = vec4(uColor, holographic);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

precision highp float;


uniform vec2 uImageSizes;
uniform vec2 uViewportSizes;
uniform vec2 uPlaneSizes;
uniform vec2 uScreenSizes;
uniform float uOpacity;
uniform sampler2D tMap;

varying vec2 vUv;

vec2 getUv(vec2 uv, vec2 textureSize, vec2 quadSize) {
  vec2 tempUv = uv - vec2(0.5);

  float quadAspect = quadSize.x / quadSize.y;
  float textureAspect = textureSize.x /textureSize.y;

  if (quadAspect < textureAspect) {
    tempUv = tempUv * vec2(quadAspect / textureAspect, 1.);
  } else {
    tempUv = tempUv * vec2(1., textureAspect / quadAspect);
  }

  tempUv += vec2(0.5);
  return tempUv;
}


void main() {

  vec2 ratio = getUv(vUv, uImageSizes, uPlaneSizes);

  vec3 texture = texture2D(tMap, ratio).rgb;
  texture = mix(texture, vec3(0.), uOpacity);

  // gl_FragColor = vec4(vec3(0.), 1.);
  gl_FragColor = vec4(texture, 1.);
}

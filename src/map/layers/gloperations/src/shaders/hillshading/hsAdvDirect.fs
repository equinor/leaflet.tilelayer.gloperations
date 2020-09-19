#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)
#pragma glslify: getTexelValue = require(./util/getTexelValue.glsl)
// #pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)
// #pragma glslify: floatToRgba = require(glsl-float-to-rgba)

uniform sampler2D tNormal;
uniform vec2 resolution;
uniform vec3 sunDirection;
uniform float nodataValue;
uniform bool littleEndian;
varying vec2 vTexCoord;

void main() {
  // vec2 dr = 1.0/resolution;
  // vec3 n = texture2D(tNormal, gl_FragCoord.xy/resolution).rgb;
  vec3 n = texture2D(tNormal, vTexCoord).rgb;
  // float v = getTexelValue(vTexCoord, tNormal, littleEndian);
  // vec3 n = vec3(v);
  float l = dot(n, sunDirection);
  l = 0.5 * l + 0.5;
  gl_FragColor = vec4(l, l, l, 1.0);
}

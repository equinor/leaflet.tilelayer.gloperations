#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

precision highp sampler2D;

#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)
#pragma glslify: floatToRgba = require(glsl-float-to-rgba)
#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)

uniform sampler2D textureA;

uniform float nodataValue;
uniform bool littleEndian;

uniform float filterLowA;
uniform float filterHighA;
uniform float multiplierA;

varying vec2 vTexCoord;

void main() {
  vec4 texelRgbaA = texture2D(textureA, vTexCoord);
  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);

  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);

  if (aIsNodata || texelFloatA < filterLowA || texelFloatA > filterHighA) {
    gl_FragColor = floatToRgba(nodataValue, littleEndian);
  } else {
    float texelFloatFinal = texelFloatA * multiplierA;
    gl_FragColor = floatToRgba(texelFloatFinal, littleEndian);
  }
}

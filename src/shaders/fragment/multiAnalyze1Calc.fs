#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: getTexelValue = require(../util/getTexelValue.glsl)
#pragma glslify: floatToRgba = require(glsl-float-to-rgba)
#pragma glslify: isCloseEnough = require(../util/isCloseEnough.glsl)

uniform sampler2D textureA;

uniform float nodataValue;
uniform bool littleEndian;

uniform float filterLowA;
uniform float filterHighA;
uniform float multiplierA;

varying vec2 vTexCoord;

void main() {
  float texelFloatA = getTexelValue(textureA, vTexCoord, littleEndian);

  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);

  if (aIsNodata || texelFloatA < filterLowA || texelFloatA > filterHighA) {
    gl_FragColor = floatToRgba(nodataValue, littleEndian);
  } else {
    float texelFloatFinal = texelFloatA * multiplierA;
    gl_FragColor = floatToRgba(texelFloatFinal, littleEndian);
  }
}

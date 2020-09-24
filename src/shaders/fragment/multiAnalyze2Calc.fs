#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: getTexelValue = require(../util/getTexelValue.glsl)
#pragma glslify: floatToRgba = require(glsl-float-to-rgba)
#pragma glslify: isCloseEnough = require(../util/isCloseEnough.glsl)

uniform sampler2D textureA;
uniform sampler2D textureB;

uniform float nodataValue;
uniform bool littleEndian;

uniform float filterLowA;
uniform float filterHighA;
uniform float filterLowB;
uniform float filterHighB;
uniform float multiplierA;
uniform float multiplierB;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  float texelFloatA = getTexelValue(textureA, vTexCoordA, littleEndian);
  float texelFloatB = getTexelValue(textureB, vTexCoordB, littleEndian);

  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);
  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);

  if (aIsNodata || bIsNodata ||
      texelFloatA < filterLowA || texelFloatA > filterHighA ||
      texelFloatB < filterLowB || texelFloatB > filterHighB
      ) {
    gl_FragColor = floatToRgba(nodataValue, littleEndian);
  } else {
    float texelFloatFinal = texelFloatA * multiplierA + texelFloatB * multiplierB;
    gl_FragColor = floatToRgba(texelFloatFinal, littleEndian);
  }
}

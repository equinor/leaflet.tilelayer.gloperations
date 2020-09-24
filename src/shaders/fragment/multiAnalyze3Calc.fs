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
uniform sampler2D textureC;

uniform float nodataValue;
uniform bool littleEndian;

uniform float filterLowA;
uniform float filterHighA;
uniform float filterLowB;
uniform float filterHighB;
uniform float filterLowC;
uniform float filterHighC;
uniform float multiplierA;
uniform float multiplierB;
uniform float multiplierC;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;
varying vec2 vTexCoordC;

void main() {
  float texelFloatA = getTexelValue(textureA, vTexCoordA, littleEndian);
  float texelFloatB = getTexelValue(textureB, vTexCoordB, littleEndian);
  float texelFloatC = getTexelValue(textureC, vTexCoordC, littleEndian);

  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);
  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);
  bool cIsNodata = isCloseEnough(texelFloatC, nodataValue);

  if (aIsNodata || bIsNodata || cIsNodata ||
      texelFloatA < filterLowA || texelFloatA > filterHighA ||
      texelFloatB < filterLowB || texelFloatB > filterHighB ||
      texelFloatC < filterLowC || texelFloatC > filterHighC
      ) {
    gl_FragColor = floatToRgba(nodataValue, littleEndian);
  } else {
    float texelFloatFinal = texelFloatA * multiplierA + texelFloatB * multiplierB + texelFloatC * multiplierC;
    gl_FragColor = floatToRgba(texelFloatFinal, littleEndian);
  }
}

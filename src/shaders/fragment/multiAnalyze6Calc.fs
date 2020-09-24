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
uniform sampler2D textureD;
uniform sampler2D textureE;
uniform sampler2D textureF;

uniform float nodataValue;
uniform bool littleEndian;

uniform float filterLowA;
uniform float filterHighA;
uniform float filterLowB;
uniform float filterHighB;
uniform float filterLowC;
uniform float filterHighC;
uniform float filterLowD;
uniform float filterHighD;
uniform float filterLowE;
uniform float filterHighE;
uniform float filterLowF;
uniform float filterHighF;
uniform float multiplierA;
uniform float multiplierB;
uniform float multiplierC;
uniform float multiplierD;
uniform float multiplierE;
uniform float multiplierF;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;
varying vec2 vTexCoordC;
varying vec2 vTexCoordD;
varying vec2 vTexCoordE;
varying vec2 vTexCoordF;

void main() {
  float texelFloatA = getTexelValue(textureA, vTexCoordA, littleEndian);
  float texelFloatB = getTexelValue(textureB, vTexCoordB, littleEndian);
  float texelFloatC = getTexelValue(textureC, vTexCoordC, littleEndian);
  float texelFloatD = getTexelValue(textureD, vTexCoordD, littleEndian);
  float texelFloatE = getTexelValue(textureE, vTexCoordE, littleEndian);
  float texelFloatF = getTexelValue(textureF, vTexCoordF, littleEndian);

  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);
  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);
  bool cIsNodata = isCloseEnough(texelFloatC, nodataValue);
  bool dIsNodata = isCloseEnough(texelFloatD, nodataValue);
  bool eIsNodata = isCloseEnough(texelFloatE, nodataValue);
  bool fIsNodata = isCloseEnough(texelFloatF, nodataValue);

  if (aIsNodata || bIsNodata || cIsNodata || dIsNodata || eIsNodata || fIsNodata ||
      texelFloatA < filterLowA || texelFloatA > filterHighA ||
      texelFloatB < filterLowB || texelFloatB > filterHighB ||
      texelFloatC < filterLowC || texelFloatC > filterHighC ||
      texelFloatD < filterLowD || texelFloatD > filterHighD ||
      texelFloatE < filterLowE || texelFloatE > filterHighE ||
      texelFloatF < filterLowF || texelFloatF > filterHighF
      ) {
    gl_FragColor = floatToRgba(nodataValue, littleEndian);
  } else {
    float texelFloatFinal = texelFloatA * multiplierA + texelFloatB * multiplierB + texelFloatC * multiplierC + texelFloatD * multiplierD + texelFloatE * multiplierE + texelFloatF * multiplierF;
    gl_FragColor = floatToRgba(texelFloatFinal, littleEndian);
  }
}

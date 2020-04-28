#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define TRANSPARENT vec4(0.0)

#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)
#pragma glslify: computeColor = require(./util/computeColor.glsl)
#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)
#pragma glslify: ScaleStop = require(./util/ScaleStop.glsl)

uniform sampler2D textureA;
uniform sampler2D textureB;
uniform sampler2D textureC;
uniform sampler2D textureD;
uniform sampler2D textureE;
uniform sampler2D textureF;

uniform ScaleStop colorScale[SCALE_MAX_LENGTH];
uniform int colorScaleLength;
uniform ScaleStop sentinelValues[SENTINEL_MAX_LENGTH];
uniform int sentinelValuesLength;

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
  vec4 texelRgbaA = texture2D(textureA, vTexCoordA);
  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);
  vec4 texelRgbaB = texture2D(textureB, vTexCoordB);
  float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);
  vec4 texelRgbaC = texture2D(textureC, vTexCoordC);
  float texelFloatC = rgbaToFloat(texelRgbaC, littleEndian);
  vec4 texelRgbaD = texture2D(textureD, vTexCoordD);
  float texelFloatD = rgbaToFloat(texelRgbaD, littleEndian);
  vec4 texelRgbaE = texture2D(textureE, vTexCoordE);
  float texelFloatE = rgbaToFloat(texelRgbaE, littleEndian);
  vec4 texelRgbaF = texture2D(textureF, vTexCoordF);
  float texelFloatF = rgbaToFloat(texelRgbaF, littleEndian);

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
    // TODO: Check if we need to disable filtering
    // https://www.opengl.org/sdk/docs/tutorials/ClockworkCoders/discard.php
    gl_FragColor = TRANSPARENT;
  } else {
    float texelFloatFinal = texelFloatA * multiplierA + texelFloatB * multiplierB + texelFloatC * multiplierC + texelFloatD * multiplierD + texelFloatE * multiplierE + texelFloatF * multiplierF;
    gl_FragColor = computeColor(texelFloatFinal, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);
  }
}

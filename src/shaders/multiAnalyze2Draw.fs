#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

// precision highp sampler2D;

#define TRANSPARENT vec4(0.0)

#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)
#pragma glslify: computeColor = require(./util/computeColor.glsl)
#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)
#pragma glslify: ScaleStop = require(./util/ScaleStop.glsl)

uniform sampler2D textureA;
uniform sampler2D textureB;

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
uniform float multiplierA;
uniform float multiplierB;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  vec4 texelRgbaA = texture2D(textureA, vTexCoordA);
  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);
  vec4 texelRgbaB = texture2D(textureB, vTexCoordB);
  float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);

  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);
  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);

  if (aIsNodata || bIsNodata ||
      texelFloatA < filterLowA || texelFloatA > filterHighA ||
      texelFloatB < filterLowB || texelFloatB > filterHighB
      ) {
    // TODO: Check if we need to disable filtering
    // https://www.opengl.org/sdk/docs/tutorials/ClockworkCoders/discard.php
    gl_FragColor = TRANSPARENT;
  } else {
    float texelFloatFinal = texelFloatA * multiplierA + texelFloatB * multiplierB;
    gl_FragColor = computeColor(texelFloatFinal, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);
  }
}

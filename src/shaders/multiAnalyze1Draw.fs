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

uniform ScaleStop colorScale[SCALE_MAX_LENGTH];
uniform int colorScaleLength;
uniform ScaleStop sentinelValues[SENTINEL_MAX_LENGTH];
uniform int sentinelValuesLength;

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
    // TODO: Check if we need to disable filtering
    // https://www.opengl.org/sdk/docs/tutorials/ClockworkCoders/discard.php
    gl_FragColor = TRANSPARENT;
  } else {
    float texelFloatFinal = texelFloatA * multiplierA;
    gl_FragColor = computeColor(texelFloatFinal, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);
  }
}

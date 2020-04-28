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

uniform ScaleStop colorScale[SCALE_MAX_LENGTH];
uniform int colorScaleLength;

uniform ScaleStop sentinelValues[SENTINEL_MAX_LENGTH];
uniform int sentinelValuesLength;

uniform float nodataValue;
uniform sampler2D textureA;
uniform sampler2D textureB;
uniform bool littleEndian;
uniform float interpolationFraction;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

bool isSentinelValue(ScaleStop sentinelValues[SENTINEL_MAX_LENGTH], int len, float value) {
  for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {
    if (i == len) {
      break;
    }
    if (isCloseEnough(sentinelValues[i].offset, value)) {
      return true;
    }
  }
  return false;
}

void main() {
  if (interpolationFraction <= 0.0) {
    vec4 texelRgba = texture2D(textureA, vTexCoordA);
    float texelFloat = rgbaToFloat(texelRgba, littleEndian);
    if (isCloseEnough(texelFloat, nodataValue)) {
      discard;
    }
    gl_FragColor = computeColor(texelFloat, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);
  } else if (interpolationFraction >= 1.0) {
    vec4 texelRgba = texture2D(textureB, vTexCoordB);
    float texelFloat = rgbaToFloat(texelRgba, littleEndian);
    if (isCloseEnough(texelFloat, nodataValue)) {
      discard;
    }
    gl_FragColor = computeColor(texelFloat, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);
  } else {
    // retrieve and decode pixel value from both tiles
    vec4 texelRgbaA = texture2D(textureA, vTexCoordA);
    float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);
    vec4 texelRgbaB = texture2D(textureB, vTexCoordB);
    float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);
    bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);
    bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);
    if (aIsNodata && bIsNodata) {
      discard;
    } else if (
      aIsNodata
      || bIsNodata
      || colorScaleLength == 0
      || isSentinelValue(sentinelValues, sentinelValuesLength, texelFloatA)
      || isSentinelValue(sentinelValues, sentinelValuesLength, texelFloatB)
    ) {
      vec4 colorA = (
        aIsNodata
        ? TRANSPARENT
        : computeColor(texelFloatA, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength)
      );
      vec4 colorB = (
        bIsNodata
        ? TRANSPARENT
        : computeColor(texelFloatB, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength)
      );
      gl_FragColor = mix(colorA, colorB, interpolationFraction);
    } else {
      float interpolated = mix(texelFloatA, texelFloatB, interpolationFraction);
      gl_FragColor = computeColor(interpolated, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);
    }
  }
}

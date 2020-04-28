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
uniform ScaleStop colorScaleA[SCALE_MAX_LENGTH];
uniform int colorScaleLengthA;
uniform ScaleStop sentinelValuesA[SENTINEL_MAX_LENGTH];
uniform int sentinelValuesLengthA;

uniform sampler2D textureB;
uniform ScaleStop colorScaleB[SCALE_MAX_LENGTH];
uniform int colorScaleLengthB;
uniform ScaleStop sentinelValuesB[SENTINEL_MAX_LENGTH];
uniform int sentinelValuesLengthB;

uniform float nodataValue;
uniform bool littleEndian;
uniform float interpolationFraction;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  if (interpolationFraction <= 0.0) {
    vec4 texelRgba = texture2D(textureA, vTexCoordA);
    float texelFloat = rgbaToFloat(texelRgba, littleEndian);
    if (isCloseEnough(texelFloat, nodataValue)) {
      discard;
    }
    gl_FragColor = computeColor(texelFloat, colorScaleA, sentinelValuesA, colorScaleLengthA, sentinelValuesLengthA);
  } else if (interpolationFraction >= 1.0) {
    vec4 texelRgba = texture2D(textureB, vTexCoordB);
    float texelFloat = rgbaToFloat(texelRgba, littleEndian);
    if (isCloseEnough(texelFloat, nodataValue)) {
      discard;
    }
    gl_FragColor = computeColor(texelFloat, colorScaleB, sentinelValuesB, colorScaleLengthB, sentinelValuesLengthB);
  } else {
    vec4 texelRgbaA = texture2D(textureA, vTexCoordA);
    float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);
    vec4 texelRgbaB = texture2D(textureB, vTexCoordB);
    float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);
    vec4 colorA = (
      isCloseEnough(texelFloatA, nodataValue)
      ? TRANSPARENT
      : computeColor(texelFloatA, colorScaleA, sentinelValuesA, colorScaleLengthA, sentinelValuesLengthA)
    );
    vec4 colorB = (
      isCloseEnough(texelFloatB, nodataValue)
      ? TRANSPARENT
      : computeColor(texelFloatB, colorScaleB, sentinelValuesB, colorScaleLengthB, sentinelValuesLengthB)
    );
    gl_FragColor = mix(colorA, colorB, interpolationFraction);
  }
}
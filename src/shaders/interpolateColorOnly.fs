#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)
#pragma glslify: computeColor = require(./util/computeColor.glsl)
#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)
#pragma glslify: ScaleStop = require(./util/ScaleStop.glsl)

uniform sampler2D texture;

uniform ScaleStop colorScaleA[SCALE_MAX_LENGTH];
uniform int colorScaleLengthA;
uniform ScaleStop sentinelValuesA[SENTINEL_MAX_LENGTH];
uniform int sentinelValuesLengthA;

uniform ScaleStop colorScaleB[SCALE_MAX_LENGTH];
uniform int colorScaleLengthB;
uniform ScaleStop sentinelValuesB[SENTINEL_MAX_LENGTH];
uniform int sentinelValuesLengthB;

uniform float nodataValue;
uniform bool littleEndian;
uniform float interpolationFraction;

varying vec2 vTexCoord;

void main() {
  vec4 texelRgba = texture2D(texture, vTexCoord);
  float texelFloat = rgbaToFloat(texelRgba, littleEndian);

  if (isCloseEnough(texelFloat, nodataValue)) {
    discard;
  }

  if (interpolationFraction <= 0.0) {
    gl_FragColor = computeColor(texelFloat, colorScaleA, sentinelValuesA, colorScaleLengthA, sentinelValuesLengthA);
  } else if (interpolationFraction >= 1.0) {
    gl_FragColor = computeColor(texelFloat, colorScaleB, sentinelValuesB, colorScaleLengthB, sentinelValuesLengthB);
  } else {
    vec4 colorA = computeColor(texelFloat, colorScaleA, sentinelValuesA, colorScaleLengthA, sentinelValuesLengthA);
    vec4 colorB = computeColor(texelFloat, colorScaleB, sentinelValuesB, colorScaleLengthB, sentinelValuesLengthB);
    gl_FragColor = mix(colorA, colorB, interpolationFraction);
  }
}
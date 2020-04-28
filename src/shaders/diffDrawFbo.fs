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
uniform sampler2D texture;
uniform bool littleEndian;

varying vec2 vTexCoord;

void main() {
  // vec4 texelRgba = texture2D(texture, vTexCoord);
  // float texelFloat = rgbaToFloat(texelRgba, littleEndian);

  float texelFloat = texture2D(texture, vTexCoord).r;
  bool isNodata = isCloseEnough(texelFloat, nodataValue);

  if (isNodata) {
    discard;
  } else {
    gl_FragColor = computeColor(texelFloat, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);
  }
}

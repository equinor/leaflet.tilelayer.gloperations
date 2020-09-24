#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: computeColor = require(../util/computeColor.glsl)
#pragma glslify: isCloseEnough = require(../util/isCloseEnough.glsl)
#pragma glslify: getTexelValue = require(../util/getTexelValue.glsl)

uniform sampler2D texture;

uniform int scaleLengthA;
uniform int sentinelLengthA;
uniform sampler2D scaleColormapA;
uniform sampler2D sentinelColormapA;

uniform int scaleLengthB;
uniform int sentinelLengthB;
uniform sampler2D scaleColormapB;
uniform sampler2D sentinelColormapB;

uniform float nodataValue;
uniform bool littleEndian;
uniform float interpolationFraction;

varying vec2 vTexCoord;

void main() {
  float texelFloat = getTexelValue(texture, vTexCoord, littleEndian);

  if (isCloseEnough(texelFloat, nodataValue)) {
    discard;
  }

  if (interpolationFraction <= 0.0) {
    gl_FragColor = computeColor(texelFloat, scaleColormapA, sentinelColormapA, scaleLengthA, sentinelLengthA, littleEndian);
  } else if (interpolationFraction >= 1.0) {
    gl_FragColor = computeColor(texelFloat, scaleColormapB, sentinelColormapB, scaleLengthB, sentinelLengthB, littleEndian);
  } else {
    vec4 colorA = computeColor(texelFloat, scaleColormapA, sentinelColormapA, scaleLengthA, sentinelLengthA, littleEndian);
    vec4 colorB = computeColor(texelFloat, scaleColormapB, sentinelColormapB, scaleLengthB, sentinelLengthB, littleEndian);
    gl_FragColor = mix(colorA, colorB, interpolationFraction);
  }
}
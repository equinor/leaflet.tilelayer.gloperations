#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define TRANSPARENT vec4(0.0)

#pragma glslify: computeColor = require(./util/computeColor.glsl)
#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)
#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)

uniform sampler2D textureA;
uniform sampler2D textureB;

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

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  if (interpolationFraction <= 0.0) {
    vec4 texelRgba = texture2D(textureA, vTexCoordA);
    float texelFloat = rgbaToFloat(texelRgba, littleEndian);
    if (isCloseEnough(texelFloat, nodataValue)) {
      discard;
    }
    gl_FragColor = computeColor(texelFloat, scaleColormapA, sentinelColormapA, scaleLengthA, sentinelLengthA, littleEndian);
  } else if (interpolationFraction >= 1.0) {
    vec4 texelRgba = texture2D(textureB, vTexCoordB);
    float texelFloat = rgbaToFloat(texelRgba, littleEndian);
    if (isCloseEnough(texelFloat, nodataValue)) {
      discard;
    }
    gl_FragColor = computeColor(texelFloat, scaleColormapB, sentinelColormapB, scaleLengthB, sentinelLengthB, littleEndian);
  } else {
    vec4 texelRgbaA = texture2D(textureA, vTexCoordA);
    float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);
    vec4 texelRgbaB = texture2D(textureB, vTexCoordB);
    float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);
    vec4 colorA = (
      isCloseEnough(texelFloatA, nodataValue)
      ? TRANSPARENT
      : computeColor(texelFloatA, scaleColormapA, sentinelColormapA, scaleLengthA, sentinelLengthA, littleEndian)
    );
    vec4 colorB = (
      isCloseEnough(texelFloatB, nodataValue)
      ? TRANSPARENT
      : computeColor(texelFloatB, scaleColormapB, sentinelColormapB, scaleLengthB, sentinelLengthB, littleEndian)
    );
    gl_FragColor = mix(colorA, colorB, interpolationFraction);
  }
}
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#define TRANSPARENT vec4(0.0)

#pragma glslify: computeColor = require(../util/computeColor.glsl)
#pragma glslify: isCloseEnough = require(../util/isCloseEnough.glsl)
#pragma glslify: getTexelValue = require(../util/getTexelValue.glsl)

uniform int scaleLength;
uniform int sentinelLength;
uniform sampler2D scaleColormap;
uniform sampler2D sentinelColormap;

uniform float nodataValue;
uniform sampler2D textureA;
uniform sampler2D textureB;
uniform bool littleEndian;
uniform float interpolationFraction;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

bool isSentinelValue(sampler2D sentinelColormap, int len, float value) {
  for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {
    if (i == len) {
      break;
    }
    float i_f = float(i);
    float lenFloat = float(len);
    float sentinelOffset = getTexelValue(sentinelColormap, vec2((i_f + 0.5) / lenFloat, 0.75), littleEndian);
    if (isCloseEnough(sentinelOffset, value)) {
      return true;
    }
  }
  return false;
}

void main() {
  if (interpolationFraction <= 0.0) {
    float texelFloat = getTexelValue(textureA, vTexCoordA, littleEndian);
    if (isCloseEnough(texelFloat, nodataValue)) {
      discard;
    }
    gl_FragColor = computeColor(
      texelFloat,
      scaleColormap,
      sentinelColormap,
      scaleLength,
      sentinelLength,
      littleEndian
    );
  } else if (interpolationFraction >= 1.0) {
    float texelFloat = getTexelValue(textureB, vTexCoordB, littleEndian);
    if (isCloseEnough(texelFloat, nodataValue)) {
      discard;
    }
    gl_FragColor = computeColor(
      texelFloat,
      scaleColormap,
      sentinelColormap,
      scaleLength,
      sentinelLength,
      littleEndian
    );
  } else {
    // retrieve and decode pixel value from both tiles
    float texelFloatA = getTexelValue(textureA, vTexCoordA, littleEndian);
    float texelFloatB = getTexelValue(textureB, vTexCoordB, littleEndian);
    bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);
    bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);
    if (aIsNodata && bIsNodata) {
      discard;
    } else if (
      aIsNodata
      || bIsNodata
      || scaleLength == 0
      || isSentinelValue(sentinelColormap, sentinelLength, texelFloatA)
      || isSentinelValue(sentinelColormap, sentinelLength, texelFloatB)
    ) {
      vec4 colorA = (
        aIsNodata
        ? TRANSPARENT
        : computeColor(
            texelFloatA,
            scaleColormap,
            sentinelColormap,
            scaleLength,
            sentinelLength,
            littleEndian
          )
      );
      vec4 colorB = (
        bIsNodata
        ? TRANSPARENT
        : computeColor(
            texelFloatB,
            scaleColormap,
            sentinelColormap,
            scaleLength,
            sentinelLength,
            littleEndian
          )
      );
      gl_FragColor = mix(colorA, colorB, interpolationFraction);
    } else {
      float interpolated = mix(texelFloatA, texelFloatB, interpolationFraction);
      gl_FragColor = computeColor(
        interpolated,
        scaleColormap,
        sentinelColormap,
        scaleLength,
        sentinelLength,
        littleEndian
      );
    }
  }
}

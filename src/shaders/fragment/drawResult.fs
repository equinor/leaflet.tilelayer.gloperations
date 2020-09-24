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
uniform sampler2D texture;
uniform bool littleEndian;

varying vec2 vTexCoord;

void main() {
  float f = getTexelValue(texture, vTexCoord, littleEndian);

  if (isCloseEnough(f, nodataValue)) {
    gl_FragColor = TRANSPARENT;
  } else {
    gl_FragColor = computeColor(
      f,
      scaleColormap,
      sentinelColormap,
      scaleLength,
      sentinelLength,
      littleEndian
    );
  }
}

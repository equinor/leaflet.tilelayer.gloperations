#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: floatToRgba = require(glsl-float-to-rgba)
#pragma glslify: isCloseEnough = require(../util/isCloseEnough.glsl)
#pragma glslify: getTexelValue = require(../util/getTexelValue.glsl)

uniform float nodataValue;
uniform bool littleEndian;
uniform sampler2D textureA;
uniform sampler2D textureB;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  float texelFloatA = getTexelValue(textureA, vTexCoordA, littleEndian);
  float texelFloatB = getTexelValue(textureB, vTexCoordB, littleEndian);
  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);
  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);

  if (aIsNodata || bIsNodata) {
    gl_FragColor = floatToRgba(nodataValue, littleEndian);
  } else {
    float diff = texelFloatB - texelFloatA;
    gl_FragColor = floatToRgba(diff, littleEndian);
  }
}

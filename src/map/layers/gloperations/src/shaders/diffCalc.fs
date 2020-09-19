#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

precision highp sampler2D;

#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)
#pragma glslify: floatToRgba = require(glsl-float-to-rgba)
#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)

uniform float nodataValue;
uniform bool littleEndian;
uniform sampler2D textureA;
uniform sampler2D textureB;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  vec4 texelRgbaA = texture2D(textureA, vTexCoordA);
  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);
  vec4 texelRgbaB = texture2D(textureB, vTexCoordB);
  float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);
  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);
  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);

  if (aIsNodata || bIsNodata) {
    gl_FragColor = floatToRgba(nodataValue, littleEndian);
  } else {
    float diff = texelFloatB - texelFloatA;
    gl_FragColor = floatToRgba(diff, littleEndian);
  }
}

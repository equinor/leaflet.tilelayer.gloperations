// #ifdef GL_FRAGMENT_PRECISION_HIGH
// precision highp float;
// #else
// precision mediump float;
// #endif

precision highp float;
precision highp sampler2D;

#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)
#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)

uniform sampler2D textureA;
uniform sampler2D textureB;

uniform float nodataValue;
uniform bool littleEndian;

uniform float filterLowA;
uniform float filterHighA;
uniform float filterLowB;
uniform float filterHighB;
uniform float multiplierA;
uniform float multiplierB;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  vec4 texelRgbaA = texture2D(textureA, vTexCoordA);
  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);
  vec4 texelRgbaB = texture2D(textureB, vTexCoordB);
  float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);

  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);
  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);

  if (aIsNodata || bIsNodata ||
      texelFloatA < filterLowA || texelFloatA > filterHighA ||
      texelFloatB < filterLowB || texelFloatB > filterHighB
      ) {
    gl_FragColor = vec4(nodataValue);
  } else {
    float texelFloatFinal = texelFloatA * multiplierA + texelFloatB * multiplierB;
    gl_FragColor = vec4(texelFloatFinal);
  }
}

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
uniform sampler2D textureA;
uniform sampler2D textureB;
uniform bool littleEndian;

// varying vec2 vTexCoord;
// varying vec2 vTexCoordB;
varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  vec4 texelRgbaA = texture2D(textureA, vTexCoordA);
  float texelFloatA = rgbaToFloat(texelRgbaA, littleEndian);
  vec4 texelRgbaB = texture2D(textureB, vTexCoordB);
  float texelFloatB = rgbaToFloat(texelRgbaB, littleEndian);
  bool aIsNodata = isCloseEnough(texelFloatA, nodataValue);
  bool bIsNodata = isCloseEnough(texelFloatB, nodataValue);
  // vec4 rgbaFloat = texture2D(texture, vTexCoord);
  // float floatValue = rgbaToFloat(rgbaFloat, littleEndian);
  // vec4 rgbaFloatsB = texture2D(textureB, vTexCoordB);
  // float pixelFloatValueB = rgbaToFloat(rgbaFloatsB, littleEndian);
  // bool aIsNodata = isCloseEnough(pixelFloatValueA, nodataValue);
  // bool bIsNodata = isCloseEnough(pixelFloatValueB, nodataValue);

  // float floatValue = texture2D(textureA, vTexCoordA).r;
  // bool isNodata = isCloseEnough(floatValue, nodataValue);

  // if (aIsNodata || bIsNodata) {
  if (aIsNodata || bIsNodata) {
    // discard;
    gl_FragColor = TRANSPARENT;
    // vec4 rgbaEncoded = floatToRgba(nodataValue, littleEndian);
    // gl_FragColor = vec4(vec3(nodataValue), 1.0)
    // gl_FragColor = rgbaEncoded;
  } else {
    float diff = texelFloatB - texelFloatA;
    // vec4 rgbaEncoded = floatToRgba(diff, littleEndian);
    // vec4 rgbaEncoded = packFloat(diff);
    // gl_FragColor = vec4(vec3(diff), 1.0);
    gl_FragColor = computeColor(diff, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);
    // gl_FragColor = rgbaEncoded;
  }
  // if (isNodata) {
  //   discard;
  // } else {
  //   // float diff = pixelFloatValueB - pixelFloatValueA;
  //   gl_FragColor = computeColor(floatValue, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);
  // }
}

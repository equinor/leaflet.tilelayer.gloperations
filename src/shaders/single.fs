#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

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
uniform bool enableSimpleHillshade;

// uniform vec2 textureSize;
uniform float textureSize;
uniform float tileSize;
uniform vec4 textureBounds;
varying vec2 vTexCoord;

uniform float offset;
uniform float slopescale;
uniform float slopeFactor;
uniform float deg2rad;
uniform float azimuth;
uniform float altitude;

float getTexelValue(vec2 pos) {
  vec4 texelRgba = texture2D(texture, pos);
  float texelFloat = rgbaToFloat(texelRgba, littleEndian);

  return texelFloat;
}

float getRelativeHeight(vec2 pos, float v, vec4 textureBounds) {
  // float n = getPointValue(pos / u_resolution);
  // float pixelFloatValue = getTexelValue(pos / textureSize);
  // if (pos.x < textureBounds[0] || pos.x > textureBounds[2] || pos.y < textureBounds[1] || pos.y > textureBounds[3]) {
  //   return 0.0;
  // }

  // if (pos.x < textureBounds[0]) {
  //   pos = vec2(textureBounds[0], pos.y);
  // }
  // if (pos.x > textureBounds[2]) {
  //   pos = vec2(textureBounds[2], pos.y);
  // }
  // if (pos.y < textureBounds[1]) {
  //   pos = vec2(pos.x, textureBounds[1]);
  // }
  // if (pos.y > textureBounds[3]) {
  //   pos = vec2(pos.x, textureBounds[3]);
  // }

  // float pixelFloatValue = getTexelValue(pos / textureSize);
  float pixelFloatValue = getTexelValue(pos);
  // vec4 rgbaFloats = texture2D(texture, vTexCoord);
  // float pixelFloatValue = rgbaToFloat(rgbaFloats, littleEndian);
  float test = step(0.0, pixelFloatValue);
  // float testReturn = ((test * pixelFloatValue) + ((1.0 - test) * v)) * u_slopescale;
  float testReturn = ((test * pixelFloatValue) + ((1.0 - test) * v)) * (slopescale*slopeFactor);
  // return ((test * n) + ((1.0 - test) * v)) * u_slopescale;
  return testReturn;
}

// float hillshade(vec2 pos, float v, vec2 onePixel) {
float hillshade(vec2 pos, float v, float offset, vec4 textureBounds) {
  // float cv = v * u_slopescale;
  float cv = v * (slopescale * slopeFactor);
  vec4 nv = vec4(
  getRelativeHeight(vec2(pos.x + offset, pos.y), v, textureBounds),
  getRelativeHeight(vec2(pos.x - offset, pos.y), v, textureBounds),
  getRelativeHeight(vec2(pos.x, pos.y + offset), v, textureBounds),
  getRelativeHeight(vec2(pos.x, pos.y - offset), v, textureBounds)
  // getRelativeHeight(vec2(pos.x + onePixel.x, pos.y), v),
  // getRelativeHeight(vec2(pos.x - onePixel.x, pos.y), v),
  // getRelativeHeight(vec2(pos.x, pos.y + onePixel.y), v),
  // getRelativeHeight(vec2(pos.x, pos.y - onePixel.y), v)
  );

  vec2 grad = vec2(
    (nv[0] - cv) / 2.0 + (cv - nv[1]) / 2.0,
    (nv[2] - cv) / 2.0 + (cv - nv[3]) / 2.0
  );

  float slope = max(3.141593 / 2.0 - atan(sqrt(dot(grad, grad))), 0.0);
  float aspect = atan(-grad.y, grad.x);

  float hs = sin(altitude * deg2rad) * sin(slope) +
    cos(altitude * deg2rad) * cos(slope) *
    cos((azimuth * deg2rad) - aspect);

  return clamp(hs, 0.0, 1.0);
}

void main() {
  float texelFloat = getTexelValue(vTexCoord);

  if (isCloseEnough(texelFloat, nodataValue)) {
    discard;
  }

  vec4 clr = computeColor(texelFloat, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);

  if (enableSimpleHillshade) {
    // vec2 onePixel = (vec2(1.0, 1.0) / textureSize) / 15.0;
    // float offset_texcoords = offset / textureSize;
    // float offset_texcoords = 1.0 / textureSize / 15.0;

    // float hs = hillshade(vTexCoord, texelFloat, onePixel);
    // float hs = hillshade(vTexCoord, texelFloat, offset_texcoords);
    float hs = hillshade(vTexCoord, texelFloat, offset, textureBounds);
    // float hs = hillshade(textureSize * gl_FragCoord.xy, texelFloat, onePixel);
    clr.rgb = clr.rgb * hs;
  }

  gl_FragColor = clr;
}

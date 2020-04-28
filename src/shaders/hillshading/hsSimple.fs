#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)

#pragma glslify: computeColor = require(../util/computeColor.glsl)
#pragma glslify: isCloseEnough = require(../util/isCloseEnough.glsl)
#pragma glslify: ScaleStop = require(../util/ScaleStop.glsl)

uniform ScaleStop colorScale[SCALE_MAX_LENGTH];
uniform int colorScaleLength;

uniform ScaleStop sentinelValues[SENTINEL_MAX_LENGTH];
uniform int sentinelValuesLength;

uniform float nodataValue;
uniform sampler2D texture;
uniform bool littleEndian;
uniform bool enableHillshade;
uniform vec2 textureSize;

varying vec2 vTexCoord;

uniform float u_slopescale;
uniform float u_azimuthrad;
uniform float u_altituderad;

float getPixelValue(vec2 pos) {
  vec4 pixelRgba = texture2D(texture, pos);
  float pixelFloatValue = rgbaToFloat(pixelRgba, littleEndian);

  return pixelFloatValue;
}

float getRelativeHeight(vec2 pos, float v) {
// float getRelativeHeight(vec4 rgbaFloats, float v) {
  // float n = getPointValue(pos / u_resolution);
  float pixelFloatValue = getPixelValue(pos / textureSize);
  // vec4 rgbaFloats = texture2D(texture, vTexCoord);
  // float pixelFloatValue = rgbaToFloat(rgbaFloats, littleEndian);
  float test = step(0.0, pixelFloatValue);
  float testReturn = ((test * pixelFloatValue) + ((1.0 - test) * v)) * u_slopescale;
  // return ((test * n) + ((1.0 - test) * v)) * u_slopescale;
  return testReturn;
}

float hillshade(vec2 pos, float v, vec2 onePixel) {
  float cv = v * u_slopescale;
  vec4 nv = vec4(
    // getRelativeHeight(vec2(pos.x + u_offset, pos.y), v),
    // getRelativeHeight(vec2(pos.x - u_offset, pos.y), v),
    // getRelativeHeight(vec2(pos.x, pos.y + u_offset), v),
    // getRelativeHeight(vec2(pos.x, pos.y - u_offset), v)
    getRelativeHeight(vec2(pos.x + onePixel.x, pos.y), v),
    getRelativeHeight(vec2(pos.x - onePixel.x, pos.y), v),
    getRelativeHeight(vec2(pos.x, pos.y + onePixel.y), v),
    getRelativeHeight(vec2(pos.x, pos.y - onePixel.y), v)
  );

  vec2 grad = vec2(
    (nv[0] - cv) / 2.0 + (cv - nv[1]) / 2.0,
    (nv[2] - cv) / 2.0 + (cv - nv[3]) / 2.0
  );

  float slope = max(3.141593 / 2.0 - atan(sqrt(dot(grad, grad))), 0.0);
  float aspect = atan(-grad.y, grad.x);

  float hs = sin(u_altituderad) * sin(slope) +
    cos(u_altituderad) * cos(slope) *
    cos(u_azimuthrad - aspect);

  return clamp(hs, 0.0, 1.0);
}

void main() {
  vec2 onePixel = vec2(1.0, 1.0) / textureSize;

  // vec4 rgbaFloats = texture2D(texture, vTexCoord);
  // float pixelFloatValue = rgbaToFloat(rgbaFloats, littleEndian);
  float pixelFloatValue = getPixelValue(vTexCoord);
  if (isCloseEnough(pixelFloatValue, nodataValue)) {
    discard;
  }
  vec4 clr = computeColor(pixelFloatValue, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);

  if (enableHillshade) {
    float hs = hillshade(vTexCoord * textureSize, pixelFloatValue, onePixel);
    clr.rgb = clr.rgb * hs;
  }

  gl_FragColor = clr;
}

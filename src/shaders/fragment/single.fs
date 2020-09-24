#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

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
uniform bool enableSimpleHillshade;

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

float getRelativeHeight(vec2 pos, float v, vec4 textureBounds) {
  float pixelFloatValue = getTexelValue(texture, pos, littleEndian);
  float test = step(0.0, pixelFloatValue);
  float testReturn = ((test * pixelFloatValue) + ((1.0 - test) * v)) * (slopescale*slopeFactor);
  return testReturn;
}

float hillshade(vec2 pos, float v, float offset, vec4 textureBounds) {
  float cv = v * (slopescale * slopeFactor);
  vec4 nv = vec4(
  getRelativeHeight(vec2(pos.x + offset, pos.y), v, textureBounds),
  getRelativeHeight(vec2(pos.x - offset, pos.y), v, textureBounds),
  getRelativeHeight(vec2(pos.x, pos.y + offset), v, textureBounds),
  getRelativeHeight(vec2(pos.x, pos.y - offset), v, textureBounds)
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
  float texelFloat = getTexelValue(texture, vTexCoord, littleEndian);

  if (isCloseEnough(texelFloat, nodataValue)) {
    discard;
  }

  vec4 clr = computeColor(
    texelFloat,
    scaleColormap,
    sentinelColormap,
    scaleLength,
    sentinelLength,
    littleEndian
  );

  if (enableSimpleHillshade) {
    float hs = hillshade(vTexCoord, texelFloat, offset, textureBounds);
    clr.rgb = clr.rgb * hs;
  }

  gl_FragColor = clr;
}

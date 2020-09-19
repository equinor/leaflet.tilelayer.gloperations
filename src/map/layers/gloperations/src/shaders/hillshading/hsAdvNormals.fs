#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)
#pragma glslify: getTexelValue = require(./util/getTexelValue.glsl)
// #pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)
#pragma glslify: floatToRgba = require(glsl-float-to-rgba)

uniform float nodataValue;
uniform bool littleEndian;
uniform sampler2D tElevation;
uniform vec2 resolution;
uniform float pixelScale;
uniform float onePixel;
varying vec2 vTexCoord;

void main() {
  vec2 dr = 1.0/resolution;

  float p0 = getTexelValue(vTexCoord, tElevation, littleEndian);
  // float p0 = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(0.0, 0.0))).r;

  float px;
  float py;
  vec3 dx;
  vec3 dy;
  vec3 n;
  // TODO: check if this needs to be used
  bool p0IsNodata = isCloseEnough(p0, nodataValue);

  if (p0IsNodata) {
    // px = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(1.0, 0.0))).r;
    px = getTexelValue(vec2(vTexCoord.x + onePixel, vTexCoord.y), tElevation, littleEndian);
    // py = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(0.0, 1.0))).r;
    py = getTexelValue(vec2(vTexCoord.x, vTexCoord.y  + onePixel), tElevation, littleEndian);
    dx = vec3(pixelScale, 0.0, px - p0);
    dy = vec3(0.0, pixelScale, py - p0);
    n = normalize(cross(dx, dy));
  } else {
    // TODO: Need to check if px or py is noData?
    // px = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(1.0, 0.0))).r;
    px = getTexelValue(vec2(vTexCoord.x + onePixel, vTexCoord.y), tElevation, littleEndian);
    // py = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(0.0, 1.0))).r;
    py = getTexelValue(vec2(vTexCoord.x, vTexCoord.y  + onePixel), tElevation, littleEndian);
    dx = vec3(pixelScale, 0.0, px - p0);
    dy = vec3(0.0, pixelScale, py - p0);
    n = normalize(cross(dx, dy));
  }

  gl_FragColor = vec4(n, 1.0);
  // gl_FragColor = vec4(0.5 * n + 0.5, 1.0); // to show

  // TODO: need to return rgb of n? three different floats?
  // how to do while still packing to rgba?
  // run program 3 times and output to 3 textures?
  // or maybe have to opt-in for OES_texture_float if using advanced shadows?
  // gl_FragColor = floatToRgba(n.r, littleEndian);
}
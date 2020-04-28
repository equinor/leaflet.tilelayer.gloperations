#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: isCloseEnough = require(../util/isCloseEnough.glsl)

uniform float nodata;
uniform sampler2D tElevation;
uniform vec2 resolution;
uniform float pixelScale;

void main() {
  vec2 dr = 1.0/resolution;
  // float pixelFloatValue = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(0.0, 0.0)));

  float p0 = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(0.0, 0.0))).r;

  float px;
  float py;
  vec3 dx;
  vec3 dy;
  vec3 n;
  // if (p0 > 99999.0) {
  bool p0IsNodata = isCloseEnough(p0, nodataValue);

  if (p0IsNodata) {
    // discard;
    // px = 1.0;
    // py = 1.0;
    px = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(1.0, 0.0))).r;
    py = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(0.0, 1.0))).r;
    dx = vec3(pixelScale, 0.0, px - p0);
    dy = vec3(0.0, pixelScale, py - p0);
    n = normalize(cross(dx, dy));
  } else {
    px = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(1.0, 0.0))).r;
    py = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(0.0, 1.0))).r;
    dx = vec3(pixelScale, 0.0, px - p0);
    dy = vec3(0.0, pixelScale, py - p0);
    n = normalize(cross(dx, dy));
  }

  // float px = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(1.0, 0.0))).r;
  // float py = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(0.0, 1.0))).r;
  // vec3 dx = vec3(pixelScale, 0.0, px - p0);
  // vec3 dy = vec3(0.0, pixelScale, py - p0);

  gl_FragColor = vec4(n, 1.0);
}
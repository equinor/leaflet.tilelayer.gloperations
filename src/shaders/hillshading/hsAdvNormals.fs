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

  float p0 = texture2D(tElevation, dr * (gl_FragCoord.xy + vec2(0.0, 0.0))).r;

  float px;
  float py;
  vec3 dx;
  vec3 dy;
  vec3 n;
  bool p0IsNodata = isCloseEnough(p0, nodataValue);

  if (p0IsNodata) {
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

  gl_FragColor = vec4(n, 1.0);
}
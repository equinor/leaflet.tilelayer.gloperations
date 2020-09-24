#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float nodataValue;
uniform bool littleEndian;
uniform sampler2D tInput;
uniform float pixelScale;
uniform float onePixel;
varying vec2 vTexCoord;

void main() {
  float p0 = texture2D(tInput, vTexCoord).r;
  float px = texture2D(tInput, vec2(vTexCoord.x + onePixel, vTexCoord.y)).r;
  float py = texture2D(tInput, vec2(vTexCoord.x, vTexCoord.y  + onePixel)).r;
  vec3 dx = vec3(pixelScale, 0.0, px - p0);
  vec3 dy = vec3(0.0, pixelScale, py - p0);
  vec3 n = normalize(cross(dx, dy));

  gl_FragColor = vec4(n, 1.0);
  // gl_FragColor = vec4(0.5 * n + 0.5, 1.0); // to show
}
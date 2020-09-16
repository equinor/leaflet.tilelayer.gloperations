#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: floatToRgba = require(glsl-float-to-rgba)

uniform float nodataValue;
uniform bool littleEndian;
uniform sampler2D texture;
varying vec2 vTexCoord;

void main() {
  //sample the texture
  vec3 rgb = texture2D(texture, vTexCoord).rgb;

  // Convert the red, green, and blue channels into a float
  float f = -10000.0 + ((rgb.r * 255.0 * 256.0 * 256.0 + rgb.g * 255.0 * 256.0 + rgb.b * 255.0) * 0.1);

  // convert to rgba and write to framebuffer
  gl_FragColor = floatToRgba(f, littleEndian);
}

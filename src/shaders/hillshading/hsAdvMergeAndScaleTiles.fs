#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)
#pragma glslify: getTexelValue = require(./util/getTexelValue.glsl)

uniform float nodataValue;
uniform bool littleEndian;
uniform sampler2D texture;
uniform float floatScale;
varying vec2 vTexCoord;

void main() {
  float f = getTexelValue(vTexCoord, texture, littleEndian);

  if (isCloseEnough(f, nodataValue)) {
    gl_FragColor = vec4(nodataValue);
  } else {
    // Scale the input value and write to framebuffer
    gl_FragColor = vec4(f * floatScale);
  }
}
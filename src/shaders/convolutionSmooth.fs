#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#define GLSLIFY 1
#endif

#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)
#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)

uniform sampler2D texture;
uniform float textureSize;
uniform bool littleEndian;
uniform float nodataValue;
varying vec2 vTexCoord;
uniform int kernelSize;

int kernelEnd = int(kernelSize/2);
int kernelStart = kernelEnd * -1;

float getTexelValue(vec2 pos) {
  vec4 texelRgba = texture2D(texture, pos);
  float texelFloat = rgbaToFloat(texelRgba, littleEndian);
  return texelFloat;
}


float runConvKernel(vec2 pos, vec2 onePixel) {
  float convKernelWeight = 0.0;
  float sum = 0.0;

  for (int i = -20; i < 20; i ++) {
    if (i < kernelStart) continue;
    if (i > kernelEnd) break;
    for (int j = -20; j < 20; j ++) {
      if (j < kernelStart) continue;
      if (j > kernelEnd) break;
      float texelValue = getTexelValue(pos + onePixel * vec2(i, j));
      if (!isCloseEnough(texelValue, nodataValue)) {
        sum = sum + texelValue;
        convKernelWeight = convKernelWeight + 1.0;
      }
    }
  }
  return (sum / convKernelWeight);
}


void main() {
  float texelFloat = getTexelValue(vTexCoord);
  if (isCloseEnough(texelFloat, nodataValue)) {
    gl_FragColor = vec4(nodataValue);
  } else {
    vec2 onePixel = vec2(1.0, 1.0) / textureSize;
    float texelFloatSmoothed = runConvKernel(vTexCoord, onePixel);
    gl_FragColor = vec4(texelFloatSmoothed);
  }
}

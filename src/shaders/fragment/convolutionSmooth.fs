#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)
#pragma glslify: floatToRgba = require(glsl-float-to-rgba)
#pragma glslify: isCloseEnough = require(../util/isCloseEnough.glsl)
#pragma glslify: getTexelValue = require(../util/getTexelValue.glsl)

uniform sampler2D texture;
uniform float textureSize;
uniform bool littleEndian;
uniform float nodataValue;
varying vec2 vTexCoord;
uniform int kernelSize;

int kernelEnd = int(kernelSize/2);
int kernelStart = kernelEnd * -1;

float runConvKernel(vec2 pos, vec2 onePixel) {
  float convKernelWeight = 0.0;
  float sum = 0.0;

  for (int i = -20; i < 20; i ++) {
    if (i < kernelStart) continue;
    if (i > kernelEnd) break;
    for (int j = -20; j < 20; j ++) {
      if (j < kernelStart) continue;
      if (j > kernelEnd) break;
      float texelValue = getTexelValue(texture, pos + onePixel * vec2(i, j), littleEndian);
      if (!isCloseEnough(texelValue, nodataValue)) {
        sum = sum + texelValue;
        convKernelWeight = convKernelWeight + 1.0;
      }
    }
  }
  return (sum / convKernelWeight);
}


void main() {
  float texelFloat = getTexelValue(texture, vTexCoord, littleEndian);
  if (isCloseEnough(texelFloat, nodataValue)) {
    gl_FragColor = floatToRgba(nodataValue, littleEndian);
  } else {
    vec2 onePixel = vec2(1.0, 1.0) / textureSize;
    float texelFloatSmoothed = runConvKernel(vTexCoord, onePixel);
    gl_FragColor = floatToRgba(texelFloatSmoothed, littleEndian);
  }
}

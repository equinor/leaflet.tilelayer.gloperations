#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: isCloseEnough = require(../util/isCloseEnough.glsl)

uniform float nodataValue;
uniform bool littleEndian;
uniform sampler2D tInput;
uniform float pixelScale;
uniform int kernelSize;
varying vec2 vTexCoord;

uniform float textureSize;

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
      float texelValue = texture2D(tInput, pos + onePixel * vec2(i, j)).r;
      if (!isCloseEnough(texelValue, nodataValue)) {
        sum = sum + texelValue;
        convKernelWeight = convKernelWeight + 1.0;
      }
    }
  }
  return (sum / convKernelWeight);
}


void main() {
  float texelFloat = texture2D(tInput, vTexCoord).r;
  if (isCloseEnough(texelFloat, nodataValue)) {
    gl_FragColor = vec4(nodataValue);
  } else {
    vec2 onePixel = vec2(1.0, 1.0) / textureSize;
    float texelFloatSmoothed = runConvKernel(vTexCoord, onePixel);
    gl_FragColor = vec4(texelFloatSmoothed);
  }
}

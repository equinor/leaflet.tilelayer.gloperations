// #pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)
#pragma glslify: rgbaToFloat = require(./rgbaToFloat.glsl)

float getTexelValue(sampler2D texture, vec2 pos, bool littleEndian) {
  vec4 texelRgba = texture2D(texture, pos);
  float texelFloat = rgbaToFloat(texelRgba, littleEndian);
  return texelFloat;
}

#pragma glslify: export(getTexelValue)

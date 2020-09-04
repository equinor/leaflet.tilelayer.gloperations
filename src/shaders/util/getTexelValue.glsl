#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)

float getTexelValue(vec2 pos, sampler2D texture, bool littleEndian) {
  vec4 texelRgba = texture2D(texture, pos);
  float texelFloat = rgbaToFloat(texelRgba, littleEndian);
  return texelFloat;
}

#pragma glslify: export(getTexelValue)

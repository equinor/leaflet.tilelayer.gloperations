#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: computeColor = require(../util/computeColor.glsl)
#pragma glslify: isCloseEnough = require(../util/isCloseEnough.glsl)
#pragma glslify: getTexelValue = require(../util/getTexelValue.glsl)

uniform int scaleLength;
uniform int sentinelLength;
uniform sampler2D scaleColormap;
uniform sampler2D sentinelColormap;

uniform float nodataValue;
uniform sampler2D texture;
uniform bool littleEndian;
uniform sampler2D hillshadePregenTexture;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  float texelFloat = getTexelValue(texture, vTexCoordA, littleEndian);

  if (isCloseEnough(texelFloat, nodataValue)) {
    discard;
  }

  vec4 clr = computeColor(
    texelFloat,
    scaleColormap,
    sentinelColormap,
    scaleLength,
    sentinelLength,
    littleEndian
  );

  // Hillshade
  float light = texture2D(hillshadePregenTexture, vTexCoordB).r;
  // float light = getTexelValue(vTexCoordB, hillshadePregenTexture, littleEndian).r;
  clr.rgb = light * pow(clr.rgb, vec3(2.0));
  clr.rgb = pow(clr.rgb, vec3(1.0/2.2));

  gl_FragColor = clr;
}

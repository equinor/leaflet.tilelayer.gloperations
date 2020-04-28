#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: rgbaToFloat = require(glsl-rgba-to-float)

#pragma glslify: computeColor = require(./util/computeColor.glsl)
#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)
#pragma glslify: ScaleStop = require(./util/ScaleStop.glsl)

uniform ScaleStop colorScale[SCALE_MAX_LENGTH];
uniform int colorScaleLength;

uniform ScaleStop sentinelValues[SENTINEL_MAX_LENGTH];
uniform int sentinelValuesLength;

uniform float nodataValue;
uniform sampler2D texture;
uniform bool littleEndian;
uniform sampler2D hillshadePregenTexture;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;


void main() {
  vec4 texelRgba = texture2D(texture, vTexCoordA);
  float texelFloat = rgbaToFloat(texelRgba, littleEndian);

  if (isCloseEnough(texelFloat, nodataValue)) {
    discard;
  }

  vec4 clr = computeColor(texelFloat, colorScale, sentinelValues, colorScaleLength, sentinelValuesLength);

  // Hillshade
  float l = texture2D(hillshadePregenTexture, vTexCoordB).r;
  clr.rgb = l * pow(clr.rgb, vec3(2.0));
  clr.rgb = pow(clr.rgb, vec3(1.0/2.2));

  gl_FragColor = clr;
}

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: computeColor = require(./util/computeColor.glsl)
#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)

uniform sampler2D tInput;
uniform sampler2D tSoftShadow;
uniform sampler2D tAmbient;
uniform float floatScale;
uniform float finalSoftMultiplier;
uniform float finalAmbientMultiplier;
uniform float nodataValue;
uniform bool littleEndian;
uniform int scaleLength;
uniform int sentinelLength;
uniform sampler2D scaleColormap;
uniform sampler2D sentinelColormap;
varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  float f = texture2D(tInput, vTexCoordA).r;

  if (isCloseEnough(f, nodataValue)) {
    gl_FragColor = vec4(0.0);
  } else {
    vec4 clr = computeColor(
      f / floatScale,
      scaleColormap,
      sentinelColormap,
      scaleLength,
      sentinelLength,
      littleEndian
    );

    float softShadow = texture2D(tSoftShadow, vTexCoordB).r;
    float ambient = texture2D(tAmbient, vTexCoordB).r;
    // Add up the lighting
    float light = finalSoftMultiplier * softShadow + finalAmbientMultiplier * ambient;
    //Deepen the original color a bit by applying a curve, and multiply it by the light
    vec3 color = light * pow(clr.rgb, vec3(2.0));
    // apply gamma correction
    color = pow(color, vec3(1.0/2.2));
    gl_FragColor = vec4(color, 1.0);
  }
}
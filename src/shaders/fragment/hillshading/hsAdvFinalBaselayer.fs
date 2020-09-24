#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D tBase;
uniform sampler2D tSoftShadow;
uniform sampler2D tAmbient;
uniform float finalSoftMultiplier;
uniform float finalAmbientMultiplier;
uniform float nodataValue;
uniform bool littleEndian;
varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  vec3 baselayer = texture2D(tBase, vTexCoordA).rgb;

  float softShadow = texture2D(tSoftShadow, vTexCoordB).r;
  float ambient = texture2D(tAmbient, vTexCoordB).r;
  // Add up the lighting
  float light = finalSoftMultiplier * softShadow + finalAmbientMultiplier * ambient;
  //Deepen the original color a bit by applying a curve, and multiply it by the light
  vec3 color = light * pow(baselayer.rgb, vec3(2.0));
  // apply gamma correction
  color = pow(color, vec3(1.0/2.2));
  gl_FragColor = vec4(color, 1.0);
}
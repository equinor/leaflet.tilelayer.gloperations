#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D tSoftShadow;
uniform sampler2D tAmbient;
uniform sampler2D tSatellite;
uniform vec2 resolution;
uniform float finalSoftMultiplier;
uniform float finalAmbientMultiplier;

void main() {
  vec2 ires = 1.0 / resolution;
  float softShadow = texture2D(tSoftShadow, ires * gl_FragCoord.xy).r;
  float ambient = texture2D(tAmbient, ires * gl_FragCoord.xy).r;
  vec3 satellite = texture2D(tSatellite, ires * gl_FragCoord.xy).rgb;
  float l = finalSoftMultiplier * softShadow + finalAmbientMultiplier * ambient;
  vec3 color = l * pow(satellite, vec3(2.0));
  color = pow(color, vec3(1.0/2.2));
  gl_FragColor = vec4(color, 1.0);
}
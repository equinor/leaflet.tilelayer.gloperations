#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

#pragma glslify: computeColor = require(./util/computeColor.glsl)
#pragma glslify: isCloseEnough = require(./util/isCloseEnough.glsl)


uniform sampler2D tInput;
uniform sampler2D tNormal;
uniform float floatScale;
uniform vec3 sunDirection;
uniform float nodataValue;
uniform bool littleEndian;
varying vec2 vTexCoord;

uniform int scaleLength;
uniform int sentinelLength;
uniform sampler2D scaleColormap;
uniform sampler2D sentinelColormap;

void main() {
  float f = texture2D(tInput, vTexCoord).r;

  if (isCloseEnough(f, nodataValue)) {
    // discard;
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

    vec3 n = texture2D(tNormal, vTexCoord).rgb;

    // light intensity that varies on the range  [−1..1]
    float light = dot(n, sunDirection);
    // transform the light intensity to the range [0..1]
    light = 0.5 * light + 0.5;

    // gl_FragColor = vec4(l, l, l, 1.0); // to show light

    vec3 color = light * pow(clr.rgb, vec3(2.0));
    color = pow(color, vec3(1.0/2.2));
    gl_FragColor = vec4(color, 1.0);
  }
}

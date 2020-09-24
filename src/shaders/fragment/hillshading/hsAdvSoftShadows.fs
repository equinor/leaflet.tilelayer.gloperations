#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D tInput;
uniform sampler2D tNormal;
uniform sampler2D tSrc;
uniform vec3 sunDirection;
uniform vec2 resolution;
uniform float pixelScale;
uniform float softIterations;
varying vec2 vTexCoord;

void main() {
  vec2 ires = 1.0 / resolution;
  vec3 src = texture2D(tSrc, gl_FragCoord.xy * ires).rgb;
  vec4 e0 = texture2D(tInput, vTexCoord);
  vec3 n0 = texture2D(tNormal, vTexCoord).rgb;

  // get 2D ray direction
  vec2 sr = normalize(sunDirection.xy);

  // initialize pixel traversal algorithm
  vec2 p0 = vTexCoord * resolution;
  vec2 p = floor(p0); // pixel we are starting in
  vec2 stp = sign(sr);

  // how far we need to travel in our ray direction to intersect the next pixel
  // in the x- and y- directions
  vec2 tMax = step(0.0, sr) * (1.0 - fract(p0)) + (1.0 - step(0.0, sr)) * fract(p0);
  tMax /= abs(sr);
  // how far must we travel along our ray to cover the width and height of a pixel
  vec2 tDelta = 1.0 / abs(sr);

  // pixel traversal routine
  for (int i = 0; i < 65536; i++) {
    if (tMax.x < tMax.y) {
      tMax.x += tDelta.x;
      p.x += stp.x;
    } else {
      tMax.y += tDelta.y;
      p.y += stp.y;
    }

    // normalized texture coordinate for the center of the current pixel
    vec2 ptex = ires * (p + 0.5);

    // If we left the tile: add some illumination to the pixel for this iteration and stop traversing
    if (ptex.x < 0.0 || ptex.x > 1.0 || ptex.y < 0.0 || ptex.y > 1.0) {
      // illumination of this single ray
      vec3 illumination = vec3(1.0/softIterations) * clamp(dot(n0, sunDirection), 0.0, 1.0);
      // add illumination of this ray to result of previous iteration
      gl_FragColor = vec4(src + illumination, 1.0);
      return;
    }

    // elevation/value at current pixel
    vec4 e = texture2D(tInput, ptex);
    // time we have traveled along the 2D ray
    float time = distance(p + 0.5, p0);
    // elevation along our original 3D ray at the current point
    float z = e0.r + time * pixelScale * sunDirection.z;

    // If we did not exit tile, have we hit the terrain?
    if (e.r > z) {
      // We hit terrain. Do not add illumination for this iteration
      gl_FragColor = vec4(src, 1.0);
      return;
    }
  }

  // Should have hit terrain or left the tile by this point, so should never need this
  // If we finish the loop somehow, let’s pretend it’s been illuminated
  vec3 illumination = vec3(1.0/softIterations) * clamp(dot(n0, sunDirection), 0.0, 1.0);
  gl_FragColor = vec4(src + illumination, 1.0);
}

uniform mat4 transformMatrix;

attribute vec2 position;
attribute vec2 texCoordA;
attribute vec2 texCoordB;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;

void main() {
  vTexCoordA = texCoordA;
  vTexCoordB = texCoordB;
  gl_Position = transformMatrix * vec4(position, 0.0, 1.0);
}

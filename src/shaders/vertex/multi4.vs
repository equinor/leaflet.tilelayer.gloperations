uniform mat4 transformMatrix;

attribute vec2 position;
attribute vec2 texCoordA;
attribute vec2 texCoordB;
attribute vec2 texCoordC;
attribute vec2 texCoordD;

varying vec2 vTexCoordA;
varying vec2 vTexCoordB;
varying vec2 vTexCoordC;
varying vec2 vTexCoordD;

void main() {
  vTexCoordA = texCoordA;
  vTexCoordB = texCoordB;
  vTexCoordC = texCoordC;
  vTexCoordD = texCoordD;
  gl_Position = transformMatrix * vec4(position, 0.0, 1.0);
}

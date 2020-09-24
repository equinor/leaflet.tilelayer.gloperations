uniform mat4 transformMatrix;

attribute vec2 position;
attribute vec2 texCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = texCoord;
  gl_Position = transformMatrix * vec4(position, 0.0, 1.0);
}

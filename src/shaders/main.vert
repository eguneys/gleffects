#version 300 es

precision mediump float;
 
in vec2 a_position;

out vec2 vQuadCoord;

uniform mat3 uMatrix;

void main() {
  vec2 position = (uMatrix * vec3(a_position, 1)).xy;

  gl_Position = vec4(position, 0, 1);

  vQuadCoord = a_position;
}

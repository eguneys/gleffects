#version 300 es

#include fdefs
 
precision mediump float;

uniform float uTime;


in vec2 vQuadCoord;

out vec4 outColor;

#include futil

void sceneColor(out vec4 col, vec2 p) {

  col = vec4(1.0, 0.0, 0.0, 1.0);

}


void main() {

  vec2 p = vQuadCoord;

  vec4 col = vec4(0.5, 0.5, 0.5, 0.0);

  sceneColor(col, p);

  outColor = col;
}

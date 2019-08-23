#version 300 es

#include fdefs
 
precision mediump float;

uniform float uTime;

in vec2 vQuadCoord;

out vec4 outColor;

#include futil
#include feffects

void main() {

  vec2 p = vQuadCoord;

  vec4 col = vec4(0.5, 0.5, 0.5, 0.0);

  hsprites(col, p);

  outColor = col;
}

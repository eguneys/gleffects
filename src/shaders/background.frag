#version 300 es

#include fcolors
#include fdefs
 
precision mediump float;

uniform vec2 uResolution;
uniform float uTime;

in vec2 vQuadCoord;

out vec4 outColor;

#include futil
#include feffects

void main() {

  vec2 p = vQuadCoord;
  p.x *= uResolution.x/uResolution.y;

  vec4 col = vec4(0.5, 0.5, 0.5, 0.0);

  // colGlowyCircle(col, p);
  // hsprites(col, p);
  col = colPurpleG;


  outColor = col;
}

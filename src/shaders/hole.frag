#version 300 es

precision mediump float;

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uTexture;

uniform vec2 uSqueeze;

in vec2 vQuadCoord;

out vec4 outColor;

#include futil


// https://stackoverflow.com/questions/57615117/how-to-wrap-space-to-make-a-black-hole-using-uv-textures-in-webgl/57615510?noredirect=1#comment101686369_57615510
void main() {

  vec2 vQ = vQuadCoord * 2.0 - 1.0;
  // vQ = sign(vQ) * (1.0 - (1.0 - abs(vQ)) * (1.0 - abs(vQ)));

  //vQ = normalize(vQ) * (1.0 - (1.0 - length(vQ)) * (1.0 - length(vQ)));

  vQ = normalize(vQ) * length(vQ) * length(vQ);

  vec2 holeCoord = vQ * 0.5 + 0.5;

  outColor = texture(uTexture, holeCoord);
  // outColor = vec4(1.0, 0.0, 0.0, 1.0);
}

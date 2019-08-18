#version 300 es
 
precision mediump float;

uniform vec2 u_resolution;

out vec4 outColor;


float sdf(vec2 p) {
  return p.x;
}

vec3 shade(float sd) {

  vec3 col = vec3(smoothstep(0.0, 0.01, abs(sd)));

  return col;
}


vec2 screenToWorld(vec2 screen) {
  vec2 result = 2.0 * (screen/u_resolution.xy - 0.5);
  result.x *= u_resolution.x/u_resolution.y;
  return result;
}

void main() {

  vec2 p = screenToWorld(gl_FragCoord.xy);

  float sd = sdf(p);

  vec3 col = shade(sd);

  outColor = vec4(col, 1.0);
}

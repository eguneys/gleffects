#version 300 es
 
precision mediump float;

uniform vec2 u_resolution;

out vec4 outColor;

float sdCircle(vec2 p, vec2 t, float r) {
  return length(p - t) - r;
}

float sdf(vec2 p) {
  float d = 1000.0;

  d = min(d, sdCircle(p, vec2(0.9, 0.5), 0.1));
  d = min(d, sdCircle(p, vec2(1.0, 0.0), 0.5));

  return d;
}

vec3 shade(float sd) {

  vec3 col = vec3(smoothstep(0.0, 0.01, abs(sd)));

  return col;
}

vec3 shadeFill(float sd) {

  vec3 col = vec3(smoothstep(0.0, 0.01, sd));

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

  vec3 col = shadeFill(sd);

  outColor = vec4(col, 1.0);
}

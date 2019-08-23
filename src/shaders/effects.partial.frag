
void vsprites(out vec4 col, vec2 p) {

  p.y += uTime * 0.001;

  vec4 col1 = vec4(255., 255., 0., 1.0);
  vec4 col2 = vec4(0., 255., 255., 1.0);
  vec4 col3 = vec4(255., 0., 180., 1.0);

  float d = mod(floor(p.y * 8.0), 3.0);

  if (d == 0.0) {
    col = col1;
  } else if (d == 1.0) {
    col = col2;
  } else {
    col = col3;
  }

}

void hsprites(out vec4 col, vec2 p) {

  float res = 5.0;
  
  vec2 u = p * res;

  int i = int(ceil(u.x) + ceil(u.y));

  float k = 0.0;

  if (i % 6 == 0) {
    k += 1.0;
  }

  vec4 front = vec4(1.0, 1.0, 0.3, 1.0),
    back = vec4(0.2, 0.1, 0.2, 1.0);

  col = mix(front, back, clamp(k, 0.0, 1.0));
}


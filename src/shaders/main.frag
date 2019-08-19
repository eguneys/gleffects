#version 300 es
 
precision mediump float;

uniform vec2 u_resolution;

out vec4 outColor;

float sdTriangleIsosceles( in vec2 q, in vec2 p )
{
    p.y -= 0.5;
    p.x = abs(p.x);
    
	vec2 a = p - q*clamp( dot(p,q)/dot(q,q), 0.0, 1.0 );
    vec2 b = p - q*vec2( clamp( p.x/q.x, 0.0, 1.0 ), 1.0 );
    
    float s = -sign( q.y );

    vec2 d = min( vec2( dot( a, a ), s*(p.x*q.y-p.y*q.x) ),
                  vec2( dot( b, b ), s*(p.y-q.y)  ));

	return -sqrt(d.x)*sign(d.y);
}

float sdLine( in vec2 p, in vec2 a, in vec2 b )
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float opUnion(float d1, float d2) {
  return min(d1, d2);
}

float opSubtraction(float d1, float d2) {
  return max(-d1, d2);
}

float opIntersection(float d1, float d2) {
  return max(d1, d2);
}

vec2 screenToWorld(vec2 screen) {
  vec2 result = 2.0 * (screen/u_resolution.xy - 0.5);
  result.x *= u_resolution.x/u_resolution.y;
  return result;
}

mat3 affineMatrix(vec2 translation, float rotation) {
  return mat3(cos(rotation), sin(rotation), 0.0,
              -sin(rotation), cos(rotation), 0.0,
              translation.x, translation.y, 1.0);
}

void heroColor(out vec3 col, vec2 p) {

  vec2 hTrans = vec2(0.0);
  float hRot = 3.14;

  p = (inverse(affineMatrix(hTrans, hRot)) * vec3(p, 1.0)).xy;

  float wedge = sdCircle(p, 0.5);

  vec2 bTrans = vec2(0.0, 0.5);
  float bRot = 0.0;
  vec2 pBubbles = 
    (-inverse(affineMatrix(bTrans, bRot)) * vec3(p, 1.0)).xy;
  float bubbles = sdCircle(pBubbles, 0.2);

  float hero = opUnion(wedge, bubbles);

  col = mix(col, vec3(1.0, 0.0, 0.0), 1.0 - smoothstep(0.0, 0.01, hero));
}

void wallColor(out vec3 col, vec2 p) {
  float wall = sdLine(p, vec2(0.0), vec2(1.0));

  col = mix(col, vec3(1.0, 0.0, 1.0), 1.0-smoothstep(0.0, 0.01,abs(wall)));
}

void sceneColor(out vec3 col, vec2 p) {

  heroColor(col, p);
  wallColor(col, p);

}


void main() {

  vec2 p = screenToWorld(gl_FragCoord.xy);

  vec3 col = vec3(0.5);

  sceneColor(col, p);

  outColor = vec4(col, 1.0);
}

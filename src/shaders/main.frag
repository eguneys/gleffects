#version 300 es

#define PI 3.14
#define HALFPI (PI * 0.5)
#define TAU (PI * 2.0)
 
precision mediump float;

uniform vec2 uResolution;

in vec2 vQuadCoord;

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

float sdBox( in vec2 p, in vec2 b )
{
  vec2 d = abs(p)-b;
  return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);
}

float sdRoundedBox(vec2 p, vec2 b, float r )
{
  return sdBox(p, b) - r;
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
  vec2 result = 2.0 * (screen/uResolution.xy - 0.5);
  result.x *= uResolution.x/uResolution.y;
  return result;
}

vec2 screenToWorld2(vec2 screen) {
  screen.x *= uResolution.x/uResolution.y;
  return screen;
}

mat3 affineMatrix(vec2 translation, float rotation, float scaling) {
  return mat3(scaling*cos(rotation), -sin(rotation), 0.0,
              sin(rotation), scaling*cos(rotation), 0.0,
              translation.x, translation.y, 1.0);
}

vec2 transform(vec2 p, vec2 translate, float rotate, float scale) {
  //p = (-inverse(affineMatrix(vec2(0.0, 0.0), 0.0, 1.0)) * vec3(p, 1.0)).xy;
  p = (-inverse(affineMatrix(translate, rotate, scale)) * vec3(p, 1.0)).xy;
  // p = (-inverse(affineMatrix(vec2(-0.0, -0.0), 0.0, 1.0)) * vec3(p, 1.0)).xy;
  return p;
}

float sdHeroBubble(vec2 p, vec2 trans, float rot) {
  vec2 pBubbles = 
    transform(p, trans, rot, 1.0);
  float bubbles = sdCircle(pBubbles, 0.25);

  return bubbles;
}


void heroColor(out vec4 col, vec2 p) {

  vec2 hTrans = vec2(0.0);
  float hRot = 3.14 *  0.0;

  p = transform(p, hTrans, hRot, 1.0);

  float wedge = sdRoundedBox(p, vec2(0.5, 0.2), 0.5);

  float bubbles = 1.0;

  for (int i = 0; i < 2; i++) {
    float c = cos(float(i)*PI);
    float s = sin(float(i)*PI);
    vec2 trans = vec2(c, s);
    float rot = 0.0;
  
    bubbles = opUnion(bubbles, sdHeroBubble(p, trans, rot));
  }

  float hero = opUnion(wedge, bubbles);

  col = mix(col, vec4(1.0, 0.0, 0.0, 1.0), 1.0 - smoothstep(0.0, 0.01, hero));
}

void wallColor(out vec4 col, vec2 p) {
  float wall = sdLine(p, vec2(0.0), vec2(-1.0));

  col = mix(col, vec4(1.0, 0.0, 1.0, 1.0), 1.0-smoothstep(0.0, 0.01,abs(wall)));
}

void sceneColor(out vec4 col, vec2 p) {

  heroColor(col, p);
  wallColor(col, p);

}


void main() {

  // vec2 p = screenToWorld(gl_FragCoord.xy);
  vec2 p = screenToWorld2(vQuadCoord);

  vec4 col = vec4(0.5, 0.5, 0.5, 0.0);

  sceneColor(col, p);
  
  outColor = col;
}

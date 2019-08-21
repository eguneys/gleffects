#version 300 es

#define PI 3.14
#define HALFPI (PI * 0.5)
#define TAU (PI * 2.0)
 
precision mediump float;

uniform float uTime;
uniform vec2 uResolution;

uniform vec2 uSqueeze;

in vec2 vQuadCoord;

out vec4 outColor;

float usin(float v) {
  return (sin(v) + 1.0) / 2.0;
}

float sdEquilateralTriangle( in vec2 p ) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - 1.0;
  p.y = p.y + 1.0/k;
  if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
  p.x -= clamp( p.x, -2.0, 0.0 );
  return -length(p)*sign(p.y);
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

float opBlend(float d1, float d2, float a)
{
 return a * d1 + (1.0 - a) * d2;
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

vec2 opRep(vec2 p, vec2 c)
{
  vec2 q = mod(p,c)-0.5*c;
  return q;
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

vec2 transform(vec2 p, vec2 trans, float rotate, float scale) {
  //p = (-inverse(affineMatrix(vec2(0.0, 0.0), 0.0, 1.0)) * vec3(p, 1.0)).xy;
  p = (-inverse(affineMatrix(trans, rotate, scale)) * vec3(p, 1.0)).xy;
  // p = (-inverse(affineMatrix(vec2(-0.0, -0.0), 0.0, 1.0)) * vec3(p, 1.0)).xy;
  return p;
}

vec2 translate(vec2 p, vec2 trans) {
  return transform(p, trans, 0.0, 1.0);
}

vec2 rotate(vec2 p, float angle) {
  return transform(p, vec2(0.0), angle, 1.0);
}

float sdHeroBubble(vec2 p, vec2 trans, float rot) {
  vec2 pBubbles = 
    transform(p, trans, rot, 1.0);
  float bubbles = sdCircle(pBubbles, 0.5);

  return bubbles;
}


void heroColor(out vec4 col, vec2 p) {

  vec2 p2 = rotate(p, uSqueeze.x);
  float wedgeBox = sdRoundedBox(p2, vec2(0.5, 0.01), 0.2);

  vec2 pSmall = transform(p, vec2(0.0), 0.0, 1.0);
  float wedgeCircle = sdCircle(pSmall, 0.4);
  
  float wedge = opBlend(wedgeBox, wedgeCircle, 
                        uSqueeze.y);

  float hero = wedge;

  col = mix(col, vec4(1.0, 0.0, 0.0, 1.0), 1.0-smoothstep(0.0, 0.02, hero));
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

  vec2 p = vQuadCoord;//screenToWorld2(vQuadCoord);

  vec4 col = vec4(0.5, 0.5, 0.5, 0.0);

  sceneColor(col, p);

  outColor = col;
}

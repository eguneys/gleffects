export default function defaults(width, height) {

  const ratio = height / width;

  const heroWidth = height * 0.2;

  const game = {
    unit: 30,
    width,
    height,
    ratio,
    vx: 10,
    tick: 0
  };

  const hole = {
    x: width * 0.5,
    y: height * 0.5,
    radius: width * 0.3,
    fG: 1
  };

  const hero = {
    width: heroWidth,
    height: heroWidth,
    theta: 0,
    w: 0.05,
    y: 0,
    vy: 0,
    aCy: -1,
    mass: 1,
    squeeze: 0.5
  };

  return {
    game,
    hole,
    hero
  };
 
}

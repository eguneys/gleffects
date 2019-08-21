export default function defaults(width, height) {

  const ratio = height / width;

  const heroWidth = height * 0.5;

  const game = {
    unit: 30,
    width,
    height,
    ratio,
    vx: 10,
    tick: 0
  };

  const hero = {
    width: heroWidth,
    height: heroWidth,
    x: width * 0.5 - heroWidth * 0.5,
    y: height * 0.5 - heroWidth * 0.5
  };

  return {
    game,
    hero
  };
 
}

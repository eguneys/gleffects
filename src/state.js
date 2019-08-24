export default function defaults(width, height) {

  const ratio = height / width;

  const wallWidth = width * 0.2;
  const heroWidth = height * 0.1;

  const game = {
    width,
    height,
    wallWidth,
    heroWidth,
    ratio,
    gravity: 50.0,
    tick: 0
  };

  return {
    game
  };
 
}

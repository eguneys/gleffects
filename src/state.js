export default function defaults() {

  const width = 256,
        height = 256,
        ratio = height / width;

  const game = {
    unit: 30,
    width,
    height,
    ratio,
    vx: 10,
    tick: 0
  };

  const hero = {
    radius: game.unit / 2,
    gap: 2,
    gapMove: 2,
    rotation: 0,
    tick: 0
  };

  return {
    game,
    hero
  };
 
}


export default function defaults() {

  const width = 2560,
        height = 1440,
        ratio = height / width;

  const game = {
    unit: 80,
    width,
    height,
    ratio,
    vx: 10
  };

  const hero = {
    radius: game.unit / 2,
    gap: 2,
    gapMove: 8,
    rotation: 0,
    tick: 0
  };

  return {
    game,
    hero
  };
 
}

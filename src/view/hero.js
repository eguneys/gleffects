import * as u from '../util';

import * as G from '../graphics';

export default function view(ctrl, g) {
  const { width, height } = ctrl.data.game;

  const { width: heroWidth } = ctrl.data.hero;
  
  const game = ctrl.data;

  let heroQuad = g.makeQuad({
    uSqueeze: G.makeUniform2fvSetter("uSqueeze"),
    uResolution: G.makeUniformSetter2f("uResolution"),
    uTime: G.makeUniformSetter("uTime"),
    uMatrix: G.makeUniform3fvSetter("uMatrix")
  }, heroWidth, heroWidth);

  this.render = ctrl => {
    const hole = ctrl.data.hole,
          hero = ctrl.data.hero;

    const c = Math.cos(hero.theta) * (hole.radius - hero.y),
          s = Math.sin(hero.theta) * (hole.radius - hero.y);

    let x = hole.x - heroWidth * 0.5 + c,
        y = hole.y - heroWidth * 0.5 + s;

    let dSqueeze = u.smoothstep(hole.radius * 0.35,
                                hole.radius * 0.5,
                                Math.abs(hero.y)) * 0.5,
        aSqueeze = (-hero.theta + u.PI * 0.5) % u.TAU;


    g.addHero(heroQuad, {
      tick: game.tick,
      squeeze: [aSqueeze, dSqueeze],
      translation: [x, y],
      rotation: Math.PI * 0.0, 
      scale: [1.0, 1.0],
      pivot: [heroWidth*0.5, heroWidth*0.5]
    });

  };

}

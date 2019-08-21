import * as u from '../util';

import * as G from '../graphics';

export default function view(ctrl, g) {
  const { width, height } = ctrl.data.game;

  const { width: heroWidth } = ctrl.data.hero;
  
  const game = ctrl.data;

  let hero = g.makeQuad({
    uSqueeze: G.makeUniform2fvSetter("uSqueeze"),
    uResolution: G.makeUniformSetter2f("uResolution"),
    uTime: G.makeUniformSetter("uTime"),
    uMatrix: G.makeUniform3fvSetter("uMatrix")
  }, heroWidth, heroWidth);


  this.render = ctrl => {
    g.addHero(hero, {
      tick: game.tick,
      squeeze: [u.PI * 0.0, 0.0],
      translation: [width*0.5 - heroWidth* 0.5, height*0.5 - heroWidth* 0.5],
      rotation: Math.PI * 0.0, 
      scale: [1.0, 1.0],
      pivot: [heroWidth*0.5, heroWidth*0.5]
    });

  };

}

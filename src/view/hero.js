import shaderMap from '../shaders';

import * as u from '../util';

import * as G from '../graphics';

export default function view(ctrl, g) {
  const { width, height } = ctrl.data.game;
  const aspect = height / width;

  const { width: heroWidth } = ctrl.data.hero;
  
  const game = ctrl.data;

  let heroQuad = g.makeQuad({
    vSource: shaderMap['vmain'],
    fSource: shaderMap['fmain'],
    uniforms: {
      uSqueeze: G.makeUniform2fvSetter("uSqueeze"),
      uResolution: G.makeUniform2fSetter("uResolution"),
      uTime: G.makeUniform1fSetter("uTime"),
      uMatrix: G.makeUniform3fvSetter("uMatrix")
    }
  }, heroWidth, heroWidth);

  this.render = ctrl => {
    const hole = ctrl.data.hole,
          hero = ctrl.data.hero;

    const { x, y } = hero;

    let dSqueeze = u.smoothstep(hole.radius * 0.35,
                                hole.radius * 0.5,
                                Math.abs(hero.j)) * 0.5,
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

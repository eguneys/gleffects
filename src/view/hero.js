import shaderMap from '../shaders';

import * as u from '../util';

import * as G from '../graphics';

export default function view(ctrl, g) {
  const { width, height, heroWidth, ratio } = ctrl.data.game;
  
  const game = ctrl.data;

  let heroQuad = g.makeQuad({
    fSource: shaderMap['fhero'],
    uniforms: {

      uResolution: G.makeUniform2fSetter("uResolution"),
      uTime: G.makeUniform1fSetter("uTime"),
      uMatrix: G.makeUniform3fvSetter("uMatrix")
    }
  }, heroWidth, heroWidth);

  this.render = ctrl => {
    const { tick } = ctrl.data;
    const heroCtrl = ctrl.play.hero;
    
    const { x: cameraX } = ctrl.play.camera.data;

    const { x, y } = heroCtrl.data;

    g.addQuad(heroQuad, {
      translation: [x - cameraX, y]
    }, {
      uTime: [tick]
    });

  };

}

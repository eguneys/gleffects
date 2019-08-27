import shaderMap from '../shaders';

import * as u from '../util';

import * as G from '../graphics';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data;

  let heroQuad = g.makeQuad({
    fSource: shaderMap['fwall'],
    uniforms: {
      uMatrix: G.makeUniform3fvSetter("uMatrix")
    }
  }, 20, 20);
  

  this.render = ctrl => {
    g.addQuad(heroQuad, {
      translation: [10, 10],
      rotation: 0.1,
      width: 20,
      height: 20
    });

  };

}

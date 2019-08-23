import shaderMap from '../shaders';

import * as u from '../util';

import * as G from '../graphics';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const background = g.makeQuad({
    fSource: shaderMap['fbg'],
    uniforms: {
      uTime: G.makeUniform1fSetter("uTime"),
      uMatrix: G.makeUniform3fvSetter("uMatrix"),
      uResolution: G.makeUniform2fSetter("uResolution")
    }
  }, width, height);

  this.render = ctrl => {

    const { tick } = ctrl.data.game;

    g.addQuad(background, {}, {
      uTime: [tick]
    });

  };

  
}

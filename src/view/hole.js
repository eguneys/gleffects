import * as u from '../util';
import shaderMap from '../shaders';

import * as G from '../graphics';

export default function hole(ctrl, g) {

  const { textures } = ctrl.data;
  const { width, height } = ctrl.data.game;
  const { fWidth, fHeight } = ctrl.data.hole;

  const field = g.makeQuad({
    name: 'field',
    fSource: shaderMap['ffield'],
    uniforms: {
      uField: G.makeUniform2fSetter("uField"),
      uMatrix: G.makeUniform3fvSetter("uMatrix")
    }
  }, fWidth, fHeight);

  this.render = () => {
    const { radius: holeRadius } = ctrl.data.hole;
    const { y: heroY, theta: heroTheta } = ctrl.data.hero;

    g.addQuad(field, {
      translation: [(width - fWidth) * 0.5, (height - fHeight) * 0.5],
      rotation: 0.0,
      scale: [1.0, 1.0],
      pivot: [fWidth * 0.5, fHeight * 0.5]
    }, {
      uField: [heroY / holeRadius, heroTheta + u.PI]
    });

  };
  
}

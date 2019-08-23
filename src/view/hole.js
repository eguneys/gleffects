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


  const grid = g.makeSprite({ 
    texture: textures['grid'],
    fSource: shaderMap['fhole'],
    uniforms: {
      uTime: G.makeUniform1fSetter("uTime"),
      uPos: G.makeUniform2fSetter("uPos"),
      uImpact: G.makeUniform1fSetter("uImpact")
    }
  }, width, height);


  this.render = () => {
    const { tick } = ctrl.data.game;

    const { radius: holeRadius } = ctrl.data.hole;
    const { y: heroY, theta: heroTheta } = ctrl.data.hero;

    g.addTexture(grid, {
      translation: [0, 0],
      rotation: 0.0,
      scale: [1.0, 1.0],
      pivot: [width * 0.5, height * 0.5]
    }, {
      uTime: [tick],
      uImpact: [0.5],
      uPos: [0.5, 0.0]
    });

    g.addQuad(field, {
      translation: [(width - fWidth) * 0.5, (height - fHeight) * 0.5],
      rotation: 0.0,
      scale: [1.0, 1.0],
      pivot: [fWidth * 0.5, fHeight * 0.5]
    }, {
      uField: [u.smoothstep(0.3, 0.8, heroY / holeRadius), heroTheta + u.PI]
    });

  };
  
}

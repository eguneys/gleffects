import shaderMap from '../shaders';

import * as u from '../util';

import * as G from '../graphics';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const { textures } = ctrl.data;

  const mWidth = width * 0.2,
        mHeight = height * 0.2;

  let bgQuad = g.makeSprite({
    texture: textures['scoreLabel']
  }, mWidth, mHeight);

  this.render = ctrl => {
    g.addTexture(bgQuad, {
      translation: [(width-mWidth) / 2, (height - mHeight) / 2],
      rotation: Math.PI * 0.0,
      scale: [1.0, 1.0],
      pivot: [width*0.5, height*0.5]
    });    
  };

}

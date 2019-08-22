import * as u from '../util';
import shaderMap from '../shaders';

import heroView from './hero';
import holeView from './hole';

export default function view(ctrl, g) {

  const { textures } = ctrl.data;
  const { width, height } = ctrl.data.game;

  const grid = g.makeSprite({ 
    texture: textures['grid'],
    fSource: shaderMap['fhole']
  }, width, height);

  const hero = new heroView(ctrl, g);

  const hole = new holeView(ctrl, g);

  this.render = ctrl => {

    g.addTexture(grid, {
      translation: [0, 0],
      rotation: 0.0,
      scale: [1.0, 1.0],
      pivot: [width * 0.5, height * 0.5]
    });

    hole.render(ctrl);

    hero.render(ctrl);
  };

}

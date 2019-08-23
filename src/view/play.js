import * as u from '../util';
import shaderMap from '../shaders';

import * as G from '../graphics';

import heroView from './hero';
import holeView from './hole';

export default function view(ctrl, g) {

  const { textures } = ctrl.data;
  const { width, height } = ctrl.data.game;

  const hero = new heroView(ctrl, g);

  const hole = new holeView(ctrl, g);

  this.render = ctrl => {
    hole.render(ctrl);

    hero.render(ctrl);
  };

}

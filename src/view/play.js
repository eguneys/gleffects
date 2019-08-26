import * as u from '../util';
import shaderMap from '../shaders';

import * as G from '../graphics';

import heroView from './hero';
import wallsView from './walls';
import blocksView from './blocks';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data;

  const hero = new heroView(ctrl, g);
  const walls = new wallsView(ctrl, g);
  const blocks = new blocksView(ctrl, g);

  this.render = ctrl => {
    walls.render(ctrl);
    blocks.render(ctrl);

    hero.render(ctrl);

  };

  this.release = () => {
    walls.release();
    blocks.release();
    hero.release();
  };

}

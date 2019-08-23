import * as u from '../util';
import shaderMap from '../shaders';

import * as G from '../graphics';

import heroView from './hero';
import holeView from './hole';
import backView from './background';

export default function view(ctrl, g) {

  const { textures } = ctrl.data;
  const { width, height } = ctrl.data.game;


  const back = new backView(ctrl, g);

  this.render = ctrl => {

    back.render(ctrl);    

  };

}

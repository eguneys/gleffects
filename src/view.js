import * as u from './util';

import heroView from './view/hero';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const hero = new heroView(ctrl, g);

  this.render = ctrl => {
    
    hero.render(ctrl);

  };

}

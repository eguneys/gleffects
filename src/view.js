import * as u from './util';

import playView from './view/play';
import menuView from './view/menu';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const play = new playView(ctrl, g);

  const menu = new menuView(ctrl, g);

  this.render = ctrl => {
    
    play.render(ctrl);

    // menu.render(ctrl);

  };

}

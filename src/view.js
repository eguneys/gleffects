import * as u from './util';

import backView from './view/background';
import playView from './view/play';
import menuView from './view/menu';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data;


  const back = new backView(ctrl, g);

  const play = new playView(ctrl, g);

  const menu = new menuView(ctrl, g);

  this.render = ctrl => {

    back.render(ctrl);
    play.render(ctrl);
    // menu.render(ctrl);
  };

  this.release = () => {
    play.release();
  };

}

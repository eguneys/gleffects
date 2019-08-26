import * as u from './util';

import backView from './view/background';
import playView from './view/play';
import menuView from './view/menu';
import uiView from './view/ui';

export default function view(ctrl, g, assets) {

  const { width, height } = ctrl.data;


  const back = new backView(ctrl, g);
  const ui = new uiView(ctrl, g, assets);
  const play = new playView(ctrl, g);
  const menu = new menuView(ctrl, g);

  this.render = ctrl => {

    back.render(ctrl);
    play.render(ctrl);
    ui.render(ctrl);
    // menu.render(ctrl);
  };

  this.release = () => {
    play.release();
  };

}

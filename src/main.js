import defaults from './state';

import Graphics from './graphics';
import makeView from './view';
import makeCtrl from './ctrl';
import Loop from 'loopz';

export function app(element, options) {

  const canvas = document.createElement('canvas'),
        gl = canvas.getContext('webgl2');

  const state = {
    ...defaults()
  };

  let graphics = new Graphics(state, gl);

  let ctrl = new makeCtrl(state, graphics);
  let view = new makeView(ctrl, graphics);

  new Loop(delta => {
    ctrl.update(delta);
    view.render(ctrl);
    graphics.render();
  }).start();

  canvas.width = state.game.width;
  canvas.height = state.game.height;
  element.append(canvas);

  if (module.hot) {
    module.hot.accept('./ctrl', function() {
      try {
        ctrl = new makeCtrl(state, ctx);
      } catch (e) {
        console.log(e);
      }
    });
    module.hot.accept('./view', function() {
      try {
        view = new makeView(ctrl, graphics);
      } catch (e) {
        console.log(e);
      }
    });
  }

}

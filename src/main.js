import defaults from './state';

import view from './view';
import makeCtrl from './ctrl';
import Loop from './loop';

export function app(element, options) {

  const canvas = document.createElement('canvas');

  const ctx = canvas.getContext('2d');

  const state = {
    ...defaults()
  };

  let ctrl = new makeCtrl(state, ctx);

  new Loop(delta => {
    ctrl.update(delta);
    view(ctrl);
  }).start();

  canvas.width = state.game.width;
  canvas.height = state.game.height;
  element.append(canvas);

  if (module.hot) {
    module.hot.accept('./ctrl', function() {
      try {
        console.log('here');

        ctrl = new makeCtrl(state, ctx);
      } catch (e) {
        console.log(e);
      }
    });
    module.hot.accept('./view', function() {
      try {
      } catch (e) {
        console.log(e);
      }
    });
  }

}

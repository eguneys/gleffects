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

  const setScale = (state) => {
    const { ratio, width, height } = state.game;
    let scale;

    if (window.innerWidth > window.innerHeight / ratio) {
      scale = (window.innerHeight / ratio) / width;
    } else {
      scale = (window.innerWidth * ratio) / height;
    }
    state.game.scale = scale;


    canvas.style.transform = `scale(${scale}, ${scale})`;
  };

  canvas.width = state.game.width;
  canvas.height = state.game.height;
  setScale(state);
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

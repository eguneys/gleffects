import { Moves } from './ctrl';

export function bindDocument(ctrl) {
  const unbinds = [];

  const onKeyDown = startMove(ctrl);
  const onKeyUp = endMove(ctrl);

  unbinds.push(unbindable(document, 'keydown', onKeyDown));
  unbinds.push(unbindable(document, 'keyup', onKeyUp));

  return () => { unbinds.forEach(_ => _()); };

}

function unbindable(el, eventName, callback) {
  el.addEventListener(eventName, callback);
  return () => el.removeEventListener(eventName, callback);
}

function endMove(ctrl) {
  return function(e) {
    switch (e.code) {
    case 'Space':
      ctrl.spaceRelease();
    }
  };
}

function startMove(ctrl) {
  return function(e) {
    switch(e.code) {
    case 'Space':
      ctrl.spaceHit();
      break;
    default:
      return;
    }
    e.preventDefault();
  };
}

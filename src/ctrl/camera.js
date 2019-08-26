import * as u from '../util';

export default function camera(ctrl, g) {

  const { width, height } = ctrl.data.game;

  let camera;
  this.init = () => {
    this.data = camera = { ...defaults() };
  };

  this.update = delta => {
    const hero = ctrl.hero,
          { x: heroX } = hero.data;

    if (heroX < width / 2) {
      camera.x = heroX - (width / 2);
    }
  };

  const defaults = () => ({
    x: 0
  });

}

import * as u from '../util';

export default function camera(ctrl, g) {

  const { width, height } = ctrl.data.game;

  let camera;
  this.init = () => {
    this.data = camera = { ...defaults() };
  };

  let centerAt = width * 0.2;

  this.update = delta => {
    const hero = ctrl.hero,
          { x: heroX } = hero.data;

    if (heroX < centerAt) {
      camera.x = heroX - centerAt;
    }
  };

  const defaults = () => ({
    x: 0
  });

}

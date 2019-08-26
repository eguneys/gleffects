import Pool from '../pool';

import * as u from '../util';

import * as c from '../collision';

export default function bullets(ctrl, g) {

  const { width, height } = ctrl.data.game;

  this.bullets = new Pool(() => new makeBullet(ctrl, g));

  this.init = () => {
    this.data = {};
  };

  const maybeSpawnBullet = u.withDelay(() => {
    const { x: cameraX } = ctrl.camera.data;

    if (cameraX > -width) {
      return;
    }

    const hero = ctrl.hero.data,
          x = hero.x,
          y = hero.y;

    this.bullets.acquire(_ => _.init({
      x,
      y
    }));

    this.bullets.releaseIf(bullet =>
      bullet.data.x - width * 0.7 > cameraX);
  }, 150);

  const updateCollisions = delta => {
    let hits = [];

    this.bullets.each(bullet => {
      ctrl.blocks.blocks.each(block => {
        if (c.collision(bullet.data, block.data)) {
          hits.push({ bullet, block });
        }
      });
    });

    hits.forEach(hit => {
      this.bullets.release(hit.bullet);
      ctrl.blocks.blocks.release(hit.block);
    });

  };

  this.update = delta => {
    maybeSpawnBullet(delta);
    updateCollisions(delta);
    this.bullets.each(_ => _.update(delta));
  };
 
}

function makeBullet(ctrl, g) {
  

  this.init = d => {
    this.data = { ...defaults(), ...d };
  };

  let radius = 150.0;
  
  this.update = delta => {
    const dt = delta * 0.01;

    this.data.vx += (1.0 - this.data.vx) * dt;

    this.data.y += -Math.sin(this.data.vx * u.TAU * 0.6) * radius * dt;
    this.data.x += -Math.cos(this.data.vx * u.PI) * radius * dt;
  };

  const defaults = () => ({
    x: 0,
    y: 0,
    vx: 0,
    width: 10,
    height: 10
  });
}

import Pool from '../pool';
import * as u from '../util';

export default function blocks(ctrl, g) {

  const { width, height } = ctrl.data.game;

  this.blocks = new Pool(() => new makeBlock(ctrl, g));

  this.init = () => {
    this.data = {};
    this.blocks.releaseAll();
  };

  const maybeSpawnBlock = u.withRandomDelay(() => {
    const { x: cameraX } = ctrl.camera.data;

    if (cameraX > -width) {
      return;
    }

    this.blocks.acquire(_ => _.init({
      x: cameraX + width,
      y: u.rand(height * 0.2, height * 0.5)
    }));

    this.blocks.releaseIf(_ => _.data.x - _.data.width * 0.5 < cameraX, () => {
      if (ctrl.data.gameover === 0) {
        ctrl.data.gameover = u.now();
      }
    });
  }, () => u.randInt(1000, 2000));
 
  this.update = delta => {
    maybeSpawnBlock(delta);
    this.blocks.each(_ => _.update(delta));    
  };
 
}


function makeBlock(ctrl, g) {

  const { width, height, heroVx } = ctrl.data.game;
  
  this.init = d => {
    this.data = { ...defaults(), ...d };
  };

  this.update = delta => {
    const { level } = ctrl.data;

    const dt = delta * 0.01;

    this.data.x += heroVx * 2.0 * dt;
    this.data.x += heroVx * dt * level * 0.1;
  };

  const defaults = () => ({
    x: width,
    y: height * 0.5,
    width: 100,
    height: 100
  });
}

import * as u from '../util';

import makeCamera from './camera';
import makeHero from './hero';
import makeWalls from './walls';
import makeBullets from './bullets';

export default function ctrl(ctrl, g) {

  this.data = ctrl.data;

  this.camera = new makeCamera(this, g);
  this.hero = new makeHero(this, g);
  this.walls = new makeWalls(this, g);
  this.bullets = new makeBullets(this, g);

  let play;
  this.init = () => {
    this.data.gameover = 0;
    this.camera.init();
    this.hero.init();
    this.walls.init();
    this.bullets.init();
  };

  this.spaceHit = () => {
    this.hero.userJump();
  };

  const maybeEndPlay = delta => {
    if (this.data.gameover > 0) {
      u.ensureDelay(this.data.gameover, () => {
        this.data.gameover = 0;
        this.data.state = u.States.Over;
      }, 1000);
    }
  };

  this.update = delta => {

    maybeEndPlay(delta);

    this.hero.update(delta);
    this.walls.update(delta);
    this.bullets.update(delta);
    this.camera.update(delta);

  };
}

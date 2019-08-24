import makeCamera from './camera';
import makeHero from './hero';
import makeWalls from './walls';

export default function ctrl(ctrl, g) {

  this.data = ctrl.data;

  this.camera = new makeCamera(this, g);
  this.hero = new makeHero(this, g);
  this.walls = new makeWalls(this, g);

  let play;
  this.init = () => {
    play = {};
    this.hero.init();
    this.walls.init();
  };

  this.spaceHit = () => {
    this.hero.userJump();
  };

  this.update = delta => {
    this.hero.update(delta);
    this.walls.update(delta);
  };
}

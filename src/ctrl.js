import Pool from './pool';

import makeHero from './ctrl/hero';
import makeWalls from './ctrl/walls';

export default function ctrl(state, g) {

  this.data = state;


  this.hero = new makeHero(this, g);
  this.walls = new makeWalls(this, g);

  this.hero.init();
  this.walls.init();

  this.spaceHit = () => {
    this.hero.userJump();
  };

  this.update = delta => {
    this.data.game.tick += delta;
    this.hero.update(delta);
    this.walls.update(delta);
  };
}

import Pool from './pool';

import makeHero from './ctrl/hero';
import makeHole from './ctrl/hole';

export default function ctrl(state, g) {

  this.data = state;


  const hero = new makeHero(this, g);
  const hole = new makeHole(this, g);

  this.jumpOver = (x, y) => {
    hole.doImpact(x, y);
  };

  this.spaceHit = () => {
    hero.userJump();
  };

  this.update = delta => {
    this.data.game.tick += delta;
    hero.update(delta);
    hole.update(delta);
  };
}

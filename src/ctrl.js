import Pool from './pool';

import makeHero from './ctrl/hero';

export default function ctrl(state, g) {

  this.data = state;


  const hero = new makeHero(this, g);

  this.spaceHit = () => {
    hero.userJump();
  };

  this.update = delta => {
    this.data.game.tick += delta;
    hero.update(delta);
  };
}

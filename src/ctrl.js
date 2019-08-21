import Pool from './pool';

import makeHero from './ctrl/hero';

export default function ctrl(state, g) {

  this.data = state;


  this.hero = new makeHero(this, g);

  this.update = delta => {

    this.data.game.tick += delta;
    
    this.hero.update(delta);
  };
}

import Pool from './pool';

import makePlay from './ctrl/play';

export default function ctrl(state, g) {
  const defaults = () => ({
    tick: 0
  });

  this.data = { ...defaults(), ...state };

  this.play = new makePlay(this, g);

  this.play.init(this);

  this.spaceHit = () => {
    this.play.hero.userJump();
  };

  this.update = delta => {
    this.data.tick++;

    this.play.update(delta);
  };
}

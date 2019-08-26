import * as u from './util';

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
    if (this.data.state === u.States.Play) {
      this.play.hero.userJump();
    } else {
      this.play.init(this);
      this.data.state = u.States.Play;
    }
  };

  this.spaceRelease = () => {
    if (this.data.state === u.States.Play) {
      this.play.hero.userReleaseJump();
    }
  };

  this.update = delta => {
    this.data.tick += delta;

    this.play.update(delta);
  };
}

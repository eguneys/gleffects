import makeColors from './colors';
import makeHero from './hero';
import makeSpark from './spark';
import Pool from './pool';

export default function ctrl(state, ctx) {
  this.ctx = ctx;
  this.data = state;

  let game = this.data.game;
  let hero = this.data.hero;

  let x, y;
  x = game.width / 2;
  y = game.height / 2;

  hero.x = x;
  hero.y = y;

  this.hero = new makeHero(this);

  this.sparks = new Pool(makeSpark, this);

  this.colors = makeColors(this);

  this.update = delta => {
    this.hero.update(delta);
    this.sparks.each(_ => _.update(delta));
  };
}

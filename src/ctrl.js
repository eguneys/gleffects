import makeColors from './colors';
import makeHero from './hero';
import makeSpark from './spark';
import Pool from './pool';

export default function ctrl(state, ctx) {
  this.ctx = ctx;
  this.data = state;


  this.update = delta => {

    this.data.game.tick += delta;
    
  };
}

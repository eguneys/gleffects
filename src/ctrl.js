import Pool from './pool';

export default function ctrl(state, g) {

  this.data = state;


  this.update = delta => {

    this.data.game.tick += delta;
    
  };
}

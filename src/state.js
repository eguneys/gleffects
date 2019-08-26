import * as u from './util';

export default function defaults(width, height) {

  const ratio = height / width;

  const wallWidth = width * 0.05;
  const heroWidth = height * 0.1;
  
  const gravity = 10.0;

  const game = {
    state: u.States.Over,
    highscore: 0,
    width,
    height,
    wallWidth,
    heroWidth,
    ratio,
    heroVx: -gravity * 4.0,
    gravity
  };

  return {
    game
  };
 
}

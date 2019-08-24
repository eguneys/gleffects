import * as u from '../util';

export default function hero(ctrl, g) {

  const { width, height, heroWidth, gravity } = ctrl.data.game;


  let hero;
  this.init = () => {
    this.data = {...defaults() };
    hero = this.data;
  };
  
  const targetAy = 0.0;

  const updatePos = delta => {
    const dt = delta * 0.01;
    console.log(hero);

    hero.vy += gravity * dt;
    hero.vy += hero.ay * dt;

    hero.y += hero.vy * dt;

    hero.ay += (targetAy - hero.ay) * dt * 2.0;

  };

  const jump = delta => {
    hero.ay = -600.0;
  };

  const maybeJump = delta => {
    if (userJump) {
      userJump = false;
      jump(delta);
    }
  };

  let userJump = false;
  this.userJump = () => {
    userJump = true;
  };

  this.update = delta => {
    maybeJump(delta);
    updatePos(delta);
  };

  const defaults = () => ({
    width: heroWidth,
    height: heroWidth,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
  });
  
}

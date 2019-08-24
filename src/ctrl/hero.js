import * as u from '../util';

export default function hero(ctrl, g) {

  const { width, height, heroWidth, gravity } = ctrl.data.game;

  let hero;
  this.init = (data) => {
    this.data = hero = { ...defaults() };
  };
  
  const updatePos = delta => {
    const dt = delta * 0.01;

    hero.vx += hero.ax * dt;

    hero.vy += gravity * dt;
    hero.vy += hero.ay * dt;

    hero.x += hero.vx * dt;
    hero.y += hero.vy * dt;

    hero.ax += (hero.targetAx-hero.ax) * dt * 2.0;
    hero.ay += -hero.ay * dt * 2.0;

  };

  const jump = delta => {
    hero.ay = hero.jumpAy;
    hero.ax = hero.jumpAx;
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
    x: width - heroWidth,
    y: 0,
    vx: 0,
    vy: 0,
    ax: 0,
    ay: 0,
    targetAx: -10.0,
    jumpAx: -100.0,
    jumpAy: -600.0
  });
  
}

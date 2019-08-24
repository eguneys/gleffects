import * as util from '../util';

export default function hero(ctrl, g) {

  const { width, height } = ctrl.data.game;
  const aspect = height / width;

  const { hole, hero } = ctrl.data;

  let targetY = 0;

  const updateXY = () => {
    const c = Math.cos(hero.theta) * (hole.radius - hero.j) / aspect,
          s = Math.sin(hero.theta) * (hole.radius - hero.j);

    hero.x = width * 0.5 - hero.width * 0.5 + c,
    hero.y = height * 0.5 - hero.width * 0.5 + s;
  };
  
  const updatePos = delta => {
    const theta = hero.w * delta * 0.01;

    hero.theta += theta;

    updateXY();

    const aGy = hole.fG / hero.mass;

    hero.vy += aGy * delta * 0.01;
    hero.vy += hero.aCy * delta * 0.01;

    hero.j += hero.vy * delta * 0.01;

    hero.j += (targetY - hero.j) * delta * 0.002;

    if (hero.j >= hole.radius * 0.5) {
      console.log('here');
      hero.mass = 1.0;
      hero.vy = 0;
      hero.j = hole.radius * 0.5;
      targetY = 0;
    } if (hero.j < -hole.radius * 0.2) {
      console.log('less');
      hero.mass = 1.0;
      hero.vy = 0;
      hero.j = -hole.radius * 0.2;
      targetY = 0;
    }
  };

  const jump = delta => {
    //console.log('jump');
    hero.mass = 0.02;
  };

  const maybeJump = delta => {
    if (userJump) {
      userJump = false;
      jump(delta);
    }
    else if (hero.j < 10.0) {
      ctrl.jumpOver(hero.x, hero.y);
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
  
}

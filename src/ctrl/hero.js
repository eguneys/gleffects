import * as util from '../util';

export default function hero(ctrl, g) {

  const { hole, hero } = ctrl.data;

  let targetY = 0;
  
  const updatePos = delta => {
    const theta = hero.w * delta * 0.01;

    hero.theta += theta;

    const aGy = hole.fG / hero.mass;

    hero.vy += aGy * delta * 0.01;
    hero.vy += hero.aCy * delta * 0.01;

    hero.y += hero.vy * delta * 0.01;

    hero.y += (targetY - hero.y) * delta * 0.002;

    if (hero.y >= hole.radius * 0.5) {
      console.log('here');
      hero.mass = 1.0;
      hero.vy = 0;
      targetY = 0;
    } if (hero.y < -hole.radius * 0.2) {
      console.log('less');
      hero.mass = 1.0;
      hero.vy = 0;
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
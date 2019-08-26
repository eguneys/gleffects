import * as u from '../util';

import * as c from '../collision';

export default function hero(ctrl, g) {

  const { width, height, wallWidth, heroWidth, gravity, heroVx } = ctrl.data.game;

  let hero;
  this.init = (data) => {
    this.data = hero = { ...defaults() };
  };

  let wallForce = 0;
  const updatePos = delta => {
    const dt = delta * 0.01;

    const oldY = hero.y;

    hero.vy += wallForce * dt;
    hero.vy += gravity * dt;

    hero.x += hero.vx * dt;
    hero.y += hero.vy * dt;

    updateCollisionsBetween(oldY, hero.y);

    hero.vx += (heroVx - hero.vx) * dt;

    wallForce = 0;
  };

  let doubleJump = 0;
  const jump = delta => {
    wallForce = 0;
    hero.vy = -hero.jumpVy;
    if (doubleJump === 1) {
      hero.vx *= 2;
    }
    if (doubleJump === 2) {
      hero.vy *= 0.8;
    }
  };


  let userJump = false;
  const maybeJump = delta => {
    if (userJump && doubleJump < 2) {
      userJump = false;
      doubleJump++;
      jump(delta);
    }
  };

  const maybeDie = delta => {
    if (hero.y - heroWidth > height) {
      if (ctrl.data.gameover === 0) {
        ctrl.data.gameover = u.now();
      }
    }
  };

  const hitWall = (wall) => {
    doubleJump = 0;
    wallForce = -gravity;
    hero.vy = 0;
    hero.y = wall.data.y - hero.height;
  };

  const updateCollisionsBetween = () => {
    const walls = ctrl.walls;
    
    const wallHit = walls.walls.find(wall => {
      return c.collision(wall.data, hero) &&
        c.collisionPlus(wall.data, hero) === c.Collision.Top;
    });

    if (wallHit) {
      hitWall(wallHit);
    }
  };



  this.userJump = () => {
    userJump = true;
  };

  this.update = delta => {
    maybeDie(delta);
    maybeJump(delta);
    updatePos(delta);
  };

  const defaults = () => ({
    width: heroWidth,
    height: heroWidth,
    x: width - heroWidth,
    y: height *0.5 - wallWidth,
    vx: -0,
    vy: 0,
    ay: 0,
    jumpVy: gravity * 6
  });
  
}

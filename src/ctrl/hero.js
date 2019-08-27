import * as u from '../util';

import * as c from '../collision';

export default function hero(ctrl, g) {

  const { width, height, wallWidth, heroWidth, gravity, heroVx } = ctrl.data.game;

  let hero;
  this.init = (data) => {
    this.data = hero = { ...defaults() };
  };

  let scaleGrav = 1.0,
      scaleVy = 1.0;

  let wallForce = 0;
  const updatePos = delta => {
    const dt = delta * 0.01;

    const oldY = hero.y;

    hero.vy += wallForce * dt * scaleVy;
    hero.vy += gravity * dt * scaleGrav;

    hero.x += hero.vx * dt;
    hero.y += hero.vy * dt;

    updateCollisionsBetween(oldY, hero.y);

    hero.vx += (heroVx - hero.vx) * dt;

    wallForce = 0;
  };

  const jump = delta => {
    wallForce = 0;
    hero.vy = -hero.jumpVy * 0.5;
    scaleGrav = 4.0;
    scaleVy = 50.0;
  };


  let jumpStart = 0,
      jumpCancel = false;
  const maybeJump = delta => {
    if (jumpStart > 0 && !jumpCancel) {
      // u.ensureDelay(jumpStart, () => {
      //   jumpCancel = true;
      //   hero.vy = -hero.jumpVy;
      // }, 1000);
      jump(delta);
    } else {
      // if (hero.vy > 0 && hero.vy < 10) {
      //   jumpCancel = false;
      //   jumpStart = 0;
      // }
    }
  };

  const maybeDie = delta => {
    if (hero.y - heroWidth > height ||
        hero.y + heroWidth < 0) {
      if (ctrl.data.gameover === 0) {
        ctrl.data.gameover = u.now();
      }
    }
  };

  const hitWall = (wall) => {
    wallForce = -gravity;
    hero.vy = 0;
    hero.y = wall.data.y - hero.height;
    jumpCancel = false;
    jumpStart = 0;
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
    jumpCancel = false;
    if (jumpStart === 0 && !jumpCancel) {
      jumpStart = u.now();
    }
  };

  this.userReleaseJump = () => {
    jumpCancel = true;
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

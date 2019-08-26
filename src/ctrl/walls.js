import Pool from '../pool';

import * as u from '../util';

export default function walls(ctrl, g) {

  const { width, height, wallWidth } = ctrl.data.game;

  this.walls = new Pool(() => new makeWall(ctrl, g));

  this.fallingWalls = new Pool(() => new makeWall(ctrl, g));

  let lastWallX;

  this.init = () => {
    lastWallX = width;
    this.data = defaults();
    this.walls.releaseAll();
    this.fallingWalls.releaseAll();

    const bWidth = 20,
          bHeight = height * 0.5 - wallWidth;
    addBuilding(bWidth, bHeight);
  };


  const addGap = () => {
    lastWallX -= wallWidth * 2.0;
  };

  const addWall = (height) => {
    const wall = this.walls.acquire(_ => _.init({ height, x: lastWallX }));

    lastWallX -= wall.data.width * 1.0;
    return wall;
  };

  const addBuilding = (bWidth, bHeight) => {
    for (let i = 0; i < bWidth; i++) {
      addWall(bHeight);
    }
    addGap();
  };

  const maybeSpawnWalls = delta => {
    const { x: cameraX } = ctrl.camera.data;

    if (lastWallX > cameraX) {
      const bHeight = u.randInt(height * 0.1, height * 0.4),
            bWidth = u.randInt(8, 20);
      addBuilding(bWidth, bHeight);
    }
  };

  const onWallRelease = wall => {
    this.fallingWalls.acquire(_ => {
      _.init({
        x: wall.data.x,
        height: wall.data.height,
        falling: true
      });
    });
  };

  const maybeFallWalls = delta => {
    const { x: cameraX } = ctrl.camera.data;

    this.walls.releaseIf(wall =>
      wall.data.x < width * 0.5 &&
      wall.data.x - width * 0.5 > cameraX, 
      onWallRelease);

    this.fallingWalls.releaseIf(wall =>
      wall.data.x - width > cameraX);
  };

  this.update = delta => {
    maybeSpawnWalls(delta);
    maybeFallWalls(delta);
    this.walls.each(_ => _.update(delta));
    this.fallingWalls.each(_ => _.update(delta));
  };

  const defaults = () => ({
    x: 0
  });
}

function makeWall(ctrl, g) {

  const { width, height, gravity, wallWidth } = ctrl.data.game;

  this.init = d => {
    this.data = { ...defaults(), ...d };
    this.data.y = height - this.data.height;
  };

  const updatePos = (delta) => {

  };

  const updateFall = delta => {
    const dt = delta * 0.01;

    this.data.rotation += -(u.PI * 0.2) * dt;
    this.data.y += gravity * dt;
  };

  const maybeFall = delta => {
    if (this.data.falling) {
      updateFall(delta);
    }
  };
  
  this.update = delta => {

    maybeFall(delta);
    updatePos(delta);
  
  };


  const defaults = () => ({
    x: 0,
    width: wallWidth,
    height: wallWidth,
    rotation: 0,
    falling: false
  });
}

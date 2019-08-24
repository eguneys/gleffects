import Pool from '../pool';

import * as u from '../util';

export default function walls(ctrl, g) {

  const { width, height, wallWidth } = ctrl.data.game;

  this.walls = new Pool(() => new makeWall(ctrl, g));

  this.init = () => {
    this.data = defaults();
    this.walls.releaseAll();

    addBuilding();
  };


  let lastWallX = width;
  const addWall = () => {
    const wall = this.walls.acquire(_ => _.init({ x: lastWallX }));
    lastWallX -= wallWidth;
    return wall;
  };

  const addBuilding = () => {
    
    const width = 3;

    for (let i = 0; i < width; i++) {
      addWall();
    }
  };

  this.update = delta => {
    this.walls.each(_ => _.update(delta));
  };

  const defaults = () => ({
    x: 0
  });
}

function makeWall(ctrl, g) {

  const { width, height } = ctrl.data.game;

  this.init = d => {
    this.data = { ...defaults(), ...d };
  };

  const updatePos = (delta) => {

    this.data.y = height - this.data.height;
    
  };
  
  this.update = delta => {

    updatePos(delta);
  
  };


  const defaults = () => ({
    x: 0,
    height: height * 0.3,
  });
}

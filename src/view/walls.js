import * as u from '../util';
import shaderMap from '../shaders';

import Pool from '../pool';
import PoolShare from '../poolshare';

import * as G from '../graphics';

export default function view(ctrl, g) {

  const { width, height, wallWidth } = ctrl.data.game;


  const wallQuads = new Pool((id) => 
    g.makeQuad({
      name: 'wall' + id,
      fSource: shaderMap['fwall'],
      uniforms: {
        uMatrix: G.makeUniform3fvSetter('uMatrix')
      }
    }, wallWidth, wallWidth)
  );

  this.render = ctrl => {
    ctrl = ctrl.play.walls;

    const { x: wallsX } = ctrl.data;

    ctrl.walls.each(wallCtrl => {
      const { x, y } = wallCtrl.data;
      let quad = wallQuads.acquire();
      g.addQuad(quad, {
        translation: [wallsX + x, y]
      });
    });
  };

  this.release = () => {
    wallQuads.releaseAll();
  };
  
}

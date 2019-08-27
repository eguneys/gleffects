import * as u from '../util';

import * as gutil from '../gutil';

export default function view(ctrl, g, assets) {

  const { width, height } = ctrl.data.game;

  const dScore = gutil.makeTextDraw(g, assets['glyps']);
  const dScoreLabel = gutil.makeTextDraw(g, assets['glyps']);

  const sOffsetX = 2,
        sOffsetY = 2;

  this.render = ctrl => {
    const { score } = ctrl.data;

    const { width: lW } = dScoreLabel("score", {
      translation: [sOffsetX, sOffsetY],
      scale: [1.0, -1.0]
    });

    dScore(score + "", {
      scale: [1.0, -1.0],
      translation: [sOffsetX + lW + 5, sOffsetY]
    });
  };
  
}

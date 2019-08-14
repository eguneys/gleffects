import * as u from './util';

import text from './text';

export default function view(ctrl, g) {

  const { width, height } = ctrl.data.game;

  const b = g.buffers;
  
  g.renderTarget = b.Screen;

  this.render = ctrl => {
    const tick = ctrl.data.game.tick,
          t = tick * 0.001;

    g.clear(0);
    let r = 40;
    for (let x = 0; x < width; x+= r) {
      for (let y = 0; y < height; y+= r) {
        let A = x - width / 2 + Math.sin(t) * r;
        let B = y - height / 2 + Math.cos(t) * r;
        let s = Math.sqrt(A*A + B*B);
        g.circle(x, y, s - 8, 21);
      }
    }

    g.clear(0);
    for (let a = 0; a < 2 * u.PI; a += 0.7) {
      for (let r = 20; r < 200; r += 9) {
        let v = a + .4 * Math.sin(a * 8 - r/20+t);
        g.fillCircle((width/2+r*Math.cos(v)), height/2+r*Math.sin(v),
                   (10 - r /12)|0, 10+(r/9%32)|0);
      }
    }

    ///debugger;
    text({
      x: 60,
      y: height - 20,
      text: 'xs-ls',
      color: 21,
      hspacing: 2,
      scale: 2
    }, g);
  };

}

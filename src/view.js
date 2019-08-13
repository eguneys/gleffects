import * as u from './util';

export default function view(state, ctx) {
  const { width, height } = state.game;
  const halfw = width / 2,
        halfh = height / 2;

  const colors = [0xff000000, 0xff342022, 0xff3c2845, 0xff313966, 0xff3b568f, 0xff2671df, 0xff66a0d9, 0xff9ac3ee, 0xff36f2fb, 0xff50e599, 0xff30be6a, 0xff6e9437, 0xff2f694b, 0xff244b52, 0xff393c32, 0xff743f3f, 0xff826030, 0xffe16e5b, 0xffff9b63, 0xffe4cd5f, 0xfffcdbcb, 0xffffffff, 0xffb7ad9b, 0xff877e84, 0xff6a6a69, 0xff525659, 0xff8a4276, 0xff3232ac, 0xff6357d9, 0xffba7bd7, 0xff4a978f, 0xff306f8a];

  

  const imageData = ctx.getImageData(0, 0, width, height);

  let buf = new ArrayBuffer(imageData.data.length);
  let buf8 = new Uint8ClampedArray(buf);
  let data = new Uint32Array(buf);

  let screen = new Uint8ClampedArray(imageData.data.length);

  const pset = (x, y, color) => {
    screen[y * width + x] = color;
  };

  const line = (x1, y1, x2, y2, color) => {
    let dy = y2 - y1,
        dx = x2 - x1,
        stepx = 1,
        stepy = 1,
        fraction;

    if (dy < 0) {
      dy = -dy;
      stepy = -1;
    }
    if (dx < 0) {
      dx = -dx;
      stepx = -1;
    }
    dy <<= 1;
    dx <<= 1;

    if (dx > dy) {
      fraction = dy - (dx >> 1);

      while (x1 != x2) {
        if (fraction >= 0) {
          y1 += stepy;
          fraction -= dx;
        }
        x1 += stepx;
        fraction += dy;
        pset(x1, y1, color);
      }
    } else {
      fraction = dx - (dy >> 1);
      while (y1 != y2) {
        if (fraction >= 0) {
          x1 += stepx;
          fraction -= dy;
        }
        y1 += stepy;
        fraction += dx;
        pset(x1, y1, color);
      }
    }

  };

  const circle = (xm, ym, r, color) => {
    let x = -r, y = 0, err = 2 - 2*r;

    do {
      pset(xm-x, ym+y, color);
      pset(xm-y, ym-x, color);
      pset(xm+x, ym-y, color);
      pset(xm+y, ym+x, color);
      r = err;
      if (r <= y) err += ++y*2 + 1;
      if (r > x || err > y) err += ++x*2 + 1;
      
    } while (x < 0);

  };

  const fillCircle = (xm, ym, r, color) => {
    let x = -r, y = 0, err = 2 - 2*r;

    do {
      screen.fill(color, (ym - y) * width + (xm + x), 
                  (ym - y) * height + (xm - x));
      screen.fill(color, (ym + y) * width + (xm + x), 
                  (ym + y) * height + (xm - x));
      r = err;
      if (r <= y) err += ++y*2 + 1;
      if (r > x || err > y) err += ++x*2 + 1;
    } while (x < 0);
  };

  const fillRect = (x1, y1, x2, y2, color) => {
    let i = Math.abs(y2 - y1);
    //screen.fill(color, y1 * width + x1, y1 * width + x2);

    while (--i) {
      screen.fill(color, (y1 + i) * width + x1, (y1 + i)*width + x2);
    }

    //screen.fill(color, y2 * width + x1, y2 * width + x2);
  };

  this.render = () => {
    let i = data.length;

    while (i--) {
      data[i] = colors[screen[i]];
    }    

    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);
  };


  (() => {

    screen.fill(1, 0, screen.length);

    let i = width - 1;
    while (i--) {
      line(0+i,0, width-1-i, height-1, i%31);
      line(0,0+i, width-1,height-1-i, i%31);
    }

    for (let j = 0; j < 32; j++) {
      fillRect(8 * j, 0, 8 * (j + 1), 12, j);

      fillCircle(halfw, halfh, halfw/2-j, j);
    }

  })();

}

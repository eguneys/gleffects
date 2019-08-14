import * as u from './util';

export default function Graphics(state, ctx) {
  const { width, height } = state.game;
  const halfw = width / 2,
        halfh = height / 2;

  const pagesize = width * height;

  this.buffers = {
    Screen: 0,
    Buffer: pagesize * 2,
    Debug: pagesize * 4,
    Scratch: pagesize * 6,
    Scratch2: pagesize * 8,
    Sprites: pagesize * 10,
    Collision: pagesize * 12,
    Midground: pagesize * 14,
    Foreground: pagesize * 16,
    Background: pagesize * 18
  };

  const b = this.buffers;


  const colors = [0xff000000, 0xff342022, 0xff3c2845, 0xff313966, 0xff3b568f, 0xff2671df, 0xff66a0d9, 0xff9ac3ee, 0xff36f2fb, 0xff50e599, 0xff30be6a, 0xff6e9437, 0xff2f694b, 0xff244b52, 0xff393c32, 0xff743f3f, 0xff826030, 0xffe16e5b, 0xffff9b63, 0xffe4cd5f, 0xfffcdbcb, 0xffffffff, 0xffb7ad9b, 0xff877e84, 0xff6a6a69, 0xff525659, 0xff8a4276, 0xff3232ac, 0xff6357d9, 0xffba7bd7, 0xff4a978f, 0xff306f8a];

  const palDefault = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];

  const twoColorPalette = [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1];
  const warmPalette = [14,0,14,3,4,5,6,7,0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7];


  let pal = palDefault;

  this.renderTarget = b.Screen;
  this.renderSource = b.Page1;

  const imageData = ctx.getImageData(0, 0, width, height);

  let buf = new ArrayBuffer(imageData.data.length);
  let buf8 = new Uint8ClampedArray(buf);
  let data = new Uint32Array(buf);

  let ram = new Uint8ClampedArray(0x80000);

  this.clear = (color) => {
    ram.fill(color, this.renderTarget, this.renderTarget + pagesize);
  };


  this.pset = (x, y, color) => {
    x = u.clamp(x | 0, 0, width);
    y = u.clamp(y | 0, 0, height);
    ram[this.renderTarget + y * width + x] = color;
  };

  const spr = (sx = 0, sy = 0, sw = 16, sh = 16, x=0, y=0, flipx = false, flipy = false) => {
    
    for (let i = 0; i < sh; i++) {
      for (let j = 0; j < sw; j++) {

        if (y+i < height && x+j < width && y+i > -1 && x+j > -1) {

          if (!flipx & !flipy) {
            let iTarget = this.renderTarget + ((y + i)*width+x+j),
                iSource = this.renderSource + ((sy + i)*width+sx+j);

            if (ram[iSource] > 0) {
              ram[iTarget] = pal[ram[iSource]];
            }
          }
        }
      }
    }

  };


  this.line = (x1, y1, x2, y2, color) => {
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

    this.pset(x1, y1, color);

    if (dx > dy) {
      fraction = dy - (dx >> 1);

      while (x1 != x2) {
        if (fraction >= 0) {
          y1 += stepy;
          fraction -= dx;
        }
        x1 += stepx;
        fraction += dy;
        this.pset(x1, y1, color);
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
        this.pset(x1, y1, color);
      }
    }

  };

  this.circle = (xm, ym, r, color) => {
    let x = -r, y = 0, err = 2 - 2*r;

    do {
      this.pset(xm-x, ym+y, color);
      this.pset(xm-y, ym-x, color);
      this.pset(xm+x, ym-y, color);
      this.pset(xm+y, ym+x, color);
      r = err;
      if (r <= y) err += ++y*2 + 1;
      if (r > x || err > y) err += ++x*2 + 1;
      
    } while (x < 0);

  };

  this.fillCircle = (xm, ym, r, color) => {
    if (r < 0) return;
    xm = xm|0; ym = ym|0; r = r|0; color = color|0;
    let x = -r, y = 0, err = 2 - 2*r;

    do {
      this.line(xm-x, ym-y, xm+x, ym-y, color);
      this.line(xm-x, ym+y, xm+x, ym+y, color);
      r = err;
      if (r <= y) err += ++y*2 + 1;
      if (r > x || err > y) err += ++x*2 + 1;
    } while (x < 0);
  };

  const fillRect = (x1, y1, x2, y2, color) => {
    let i = Math.abs(y2 - y1);

    this.line(x1, y1, x2, y1, color);

    if (i > 0) {
      while (--i) {
        this.line(x1, y1 + i, x2, y1 + i, color);
      }
    }
    this.line(x1, y2, x2, y2, color);
  };

  this.fr = (x, y, w, h, color) => {
    let x1 = x|0,
        y1 = y|0,
        x2 = (x+w)|0,
        y2 = (y+h)|0;

    let i = Math.abs(y2 - y1);
    this.line(x1, y1, x2, y1, color);

    if (i > 0) {
      while (--i) {
        this.line(x1, y1+i, x2, y1+i, color);
      }
    }
    this.line(x1, y2, x2, y2, color);    
  };

  const checker = (nRow, nCol, color) => {
    let w = width,
        h = height,
        x = 0,
        y = 0;

    w /= nCol;
    h /= nRow;

    for (let i = 0; i < nRow; ++i) {
      for (let j = 0, col = nCol / 2; j < col; ++j) {
        x = 2 * j * w + (i % 2 ? 0 : w);
        y = i * h;
        fillRect(x, y, x + w, y + h, color);
      }
    }
  };

  this.render = () => {

    let i = 0x10000;

    while (i--) {
      data[i] = colors[pal[ram[i]]];
    }    

    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);
  };
}

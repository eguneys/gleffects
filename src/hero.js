import * as u from './util';

export default function hero(ctrl) {
  this.ctx = ctrl.ctx;
  this.data = ctrl.data.hero;

  const { game } = ctrl.data;
  const { radius } = this.data;

  this.scratch = document.createElement('canvas');
  const scratchCtx = this.scratch.getContext('2d');
  this.scratch.width = radius * 2;
  this.scratch.height = radius * 2;
  scratchCtx.beginPath();
  scratchCtx.arc(radius, radius, radius, 0, u.TAU);
  scratchCtx.fillStyle = 'hsla(0, 0%, 100%, 0.5)';
  scratchCtx.fill();
  scratchCtx.beginPath();
  scratchCtx.arc(radius - 10, radius + 0, radius, 0, u.TAU);
  scratchCtx.globalCompositeOperation = 'destination-out';
  scratchCtx.fillStyle = '#000';
  scratchCtx.fill();


  this.update = dt => {
    const vxBase = game.vx;
    this.data.vx = vxBase;
    this.data.rotation += this.data.vx / 440;

    let size = u.rand(radius / 10, radius / 6),
        angle;

    angle = u.rand(u.PI + 0.1, u.PI + 0.6);

    ctrl.sparks.create({
      x: this.data.x + u.rand(-5, 5),
      y: this.data.y + this.data.radius,// + u.rand(0, -5),
      vel: this.data.vx,
      angle,
      w: size,
      h: size,
      decay: 0.02
    });
    
    this.data.tick += dt;
  };
}

import * as u from './util';

function renderWedge(ctrl, color, rotation, offset) {
  const { ctx } = ctrl;
  const { gapMove, gap, radius, tick } = ctrl.hero.data;

  const length = gap + (0.5 + Math.sin(tick * 0.01) / 2) * gapMove,
        x = Math.cos(u.THIRDPI) * length,
        y = Math.sin(u.THIRDPI) * length;

  ctx.save();
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.arc(0, 0, radius, length / (radius * 1.125), u.THIRDTAU - length / (radius * 1.125), false);
  ctx.lineTo(x, y);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function renderMoonHighlight(ctrl) {
  const { ctx } = ctrl;
  const { scratch } = ctrl.hero;
  const { x, y, radius } = ctrl.hero.data;
  
  ctx.save();
  ctx.globalCompositeOperation = 'destination-over';
  ctx.drawImage(scratch, x - radius, y - radius);
  ctx.restore();
}

function renderGradientHighlight(ctrl) {
  const { ctx } = ctrl;
  const { game } = ctrl.data;
  const { heroGradientSize, heroGradient } = ctrl.colors;

  const { x, y } = ctrl.hero.data;


  ctx.save();
  ctx.translate(x - (heroGradientSize / 2), y - heroGradientSize / 2);
  ctx.fillStyle = heroGradient;
  //ctx.globalCompositeOperation = 'source-';
  ctx.fillRect(0, 0, heroGradientSize, heroGradientSize);
  ctx.restore();
}

function renderHero(ctrl) {
  const { ctx } = ctrl;
  const { x, y, rotation, tick } = ctrl.hero.data;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  let alpha = 0.75 + Math.sin(tick * 0.01) * 0.25;
  renderWedge(ctrl, 'hsla(0, 0%, 50%, ' + alpha + ')', 0, 0);
  renderWedge(ctrl, 'hsla(120, 0%, 50%, ' + alpha + ')', u.THIRDTAU, 0);
  renderWedge(ctrl, 'hsla(240, 0%, 50%, ' + alpha + ')', u.THIRDTAU * 2, 0);
  ctx.restore();

  renderMoonHighlight(ctrl);
  renderGradientHighlight(ctrl);
}

function renderSpark(ctrl) {
  const { ctx } = ctrl;

  const { x, y, w, h } = ctrl.data;
  const { alpha, scale, rotation } = ctrl;

  ctx.save();
  ctx.translate(x - w / 2, y - h / 2);
  ctx.scale(scale, scale);
  ctx.rotate(rotation);
  ctx.fillStyle = 'hsla(0, 0%, 100%, ' + alpha +')';
  ctx.fillRect(- w / 2, - w / 2, w, h);
  ctx.restore();
}

function renderSparks(ctrl) {
  ctrl.sparks.each(renderSpark);
}

export default function view(ctrl) {
  clear(ctrl);
  renderHero(ctrl);
  renderSparks(ctrl);

}


function clear(ctrl) {
  const { ctx } = ctrl;
  const { width, height } = ctrl.data.game;

  const { vignetteGradient } = ctrl.colors;

  // ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = vignetteGradient;
  ctx.fillRect(0, 0, width, height);
}

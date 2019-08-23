export default function textures() {
  const tss = {};

  tss['scoreLabel'] = labelTexture('SCORE');

  tss['grid'] = gridTexture();
  
  return tss;
};

const gridTexture = () => withCanvasTexture(1024, 1024, (w, h, ctx, canvas) => {
  const gap = w * 0.008;

  ctx.strokeStyle = 'yellow';
  ctx.lineWidth = 0.08;
  ctx.beginPath();

  ctx.fillStyle = 'white';
  ctx.moveTo(0, 0);
  // ctx.fillRect(0, 0, 100, 100);

  for (let i = 0; i < w; i+= gap) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, h);
  }
  for (let i = 0; i < h; i+= gap) {
    ctx.moveTo(0, i);
    ctx.lineTo(w, i);
  }
  ctx.stroke();

  return canvas;
});

const labelTexture = (label) => {
  return withCanvasTexture(label.length * 100 * 0.5, 100, (w, h,  ctx, canvas) => {
    // ctx.fillStyle = 'red';
    // ctx.fillRect(0, 0, w, h);
    ctx.font = '50pt Comic Sans';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, 50);
    
    return canvas;
  });
};

function withCanvasTexture(width, height, f) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  f(width, height, canvas.getContext('2d'), canvas);
  const texture = canvas;
  // document.body.append(canvas);
  return texture;
}

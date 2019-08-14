import makeLetters from './letters';

const letters = makeLetters();

function textLine(o, g) {
  let textLength = o.text.length,
      size = 5;

  for (let i = 0; i < textLength; i++) {
    let letter = letters[o.text.charAt(i)] || letters['unknown'];
    // letter = letter.split('\n').map(_ => _.split(''));
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (letter[y][x] === '.') {
          if (o.scale === 1) {
            g.pset(o.x + x + (size + o.hspacing) * i,
                 o.y + y,
                   o.color);
          } else {
            g.fr(
              o.x + (x * o.scale) + (size * o.scale + o.hspacing) *i,
              o.y + (y * o.scale),
              o.scale,
              o.scale,
              o.color);
          }
        }
      }
    }
  }
}

export default function text(o, g) {
  o = { ...defaults(), ...o };
  let size = 5,
      letterSize = size * o.scale,
      lines = o.text.split('\n'),
      linesCopy = lines.slice(0),
      lineCount = lines.length,
      longestLine = linesCopy.sort((a, b) => b.length - a.length)[0],
      textWidth = (longestLine.length * letterSize) + (longestLine.length - 1) * o.hspacing,
      textHeight = (lineCount * letterSize) + (lineCount - 1) * o.vspacing;

  let sx = o.x,
      sy = o.y,
      ex = o.x + textWidth,
      ey = o.y + textHeight;


  let cx = sx + textWidth / 2,
      cy = sy + textHeight / 2;

  if (o.render) {
    for (let i = 0; i < lineCount; i++) {
      let line = lines[i],
          lineWidth = (line.length * letterSize) + (line.length - 1) * o.hspacing,
          x = o.x,
          y = o.y + (letterSize + o.vspacing) * i;

      textLine({
        x, y,
        text: line,
        hspacing: o.hspacing || 0,
        scale: o.scale || 1,
        color: o.color
      }, g);
    }
  }

  return {
    sx,
    sy,
    cx,
    cy,
    ex,
    ey,
    width: textWidth,
    height: textHeight
  };
}

function defaults() {
  return {
    scale: 1,
    hspacing: 1,
    vspacing: 1,
    halign: 'left',
    valign: 'bottom',
    render: true
  };
};

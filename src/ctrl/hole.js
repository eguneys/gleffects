import * as u from '../util';

export default function hole(ctrl, g) {
  const { hole } = ctrl.data;

  const easing = makeEasing([0.5, 0.55, 0.4, 0.75, 0.35, 0.5]);
  let impact = 0.0;

  this.doImpact = (x, y) => {
    impact = 1.0;
    hole.x = x;
    hole.y = y;
  };

  this.update = delta => {

    hole.impact = easing(impact);
    impact += (0.0 - impact) * delta * 0.001;
    
  };
}

function makeEasing(breakpoints) {
  const spaces = breakpoints.length - 1;
  return t => {
    const iPoint = Math.floor(t / (1 / spaces)),
          iDest = iPoint + 1;
    return breakpoints[iPoint] + (breakpoints[iDest] - breakpoints[iPoint]) * u.smoothstep(0, 1/spaces, (t % (1/spaces)));
    
  };
}



function testEasing(easing) {
  for (let i = 0; i< 1; i+= 0.01) {
    console.log(u.round(i), u.round(easing(i)));
  }
}

// const easing2 = makeEasing([0.5, 0.0, 0.5, 1.0, 0.5]);

// testEasing(easing2);


const easing = t => {
  return .04 * t / (--t) * Math.sin(25 * t);
};

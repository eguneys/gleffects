import * as u from '../util';

export default function hole(ctrl, g) {
  const { hole, hero } = ctrl.data;

  // impact         0.0   ->             1.0
  // easing(impact) 0.0 -> 1.0 -> 0.9 -> 1.0
  // map(impact) 0.5 -> 0.0 -> 0.5 -> 1.0 -> 0.5

  const easing = makeEasing([0.5, 0.55, 0.4, 0.8, 0.2, 0.5]);
  let impact = 0.0;

  const updatePos = delta => {
    impact = 1.0;
    hole.x = hero.x;
    hole.y = hero.y;
  };

  this.update = delta => {

    if (impact < 0.01) {
      updatePos(delta);
    }

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

export const PI = Math.PI;
export const HALFPI = PI / 2;
export const THIRDPI = PI / 3;
export const TAU = PI * 2;
export const THIRDTAU = TAU / 3;

export function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

export default function Pool(makeItem) {

  const makeId = (() => {
    let n = 0;
    return () => n++;
  })();

  let alive = [],
      dead = [];

  this.alives = () => alive.length;

  this.acquire = (onInit = () => {}) => {
    let item;
    if (dead.length > 0) {
      item = dead.pop();
    } else {
      item = makeItem(makeId());
    }
    onInit(item);
    alive.push(item);
    return item;

  };

  this.release = (item) => {
    let i = alive.indexOf(item);
    if (i > -1) {
      dead.push(alive.splice(i, 1)[0]);
    }
  };

  this.releaseAll = () => {
    alive.forEach(_ => dead.push(_));
    alive = [];
  };

  this.releaseIf = (p, onRelease = () => {}) => {
    let release = [],
        keep = [];

    alive.forEach(_ => {
      if (p(_)) {
        onRelease(_);
        release.push(_);
      } else {
        keep.push(_);
      }
    });

    alive = keep;
    dead = [...release, ...dead];
  };

  this.each = (f) => {
    alive.forEach(f);
  };

  this.find = p => {
    return alive.find(p);
  };

}

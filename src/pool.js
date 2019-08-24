export default function Pool(makeItem) {

  const makeId = (() => {
    let n = 0;
    return () => n++;
  })();

  let alive = [],
      dead = [];

  this.alives = () => alive.length;

  this.acquire = (initItem = () => {}) => {
    let item;
    if (dead.length > 0) {
      item = dead.pop();
    } else {
      item = makeItem(makeId());
    }
    initItem(item);
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

  this.each = (f) => {
    alive.forEach(f);
  };

}

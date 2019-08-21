export function objMap(obj, f) {
  return Object.keys(obj).reduce((acc, _) => ({
    [_]: f(_, obj[_]),
    ...acc }), {});
};

import pathToRegexp from 'path-to-regexp';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

export default (pattern, parameters) => {
  if (!pattern) {
    throw new Error('Cant compile path. No pattern provided.');
  }

  if (cache[pattern]) { return decodeURIComponent(cache[pattern](parameters)); }

  const toPath = pathToRegexp.compile(pattern);

  if (cacheCount < cacheLimit) {
    cache[pattern] = toPath;
    cacheCount++;
  }

  return decodeURIComponent(toPath(parameters));
};

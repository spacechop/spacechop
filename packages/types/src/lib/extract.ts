import pathToRegexp from 'path-to-regexp';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

export default (pattern) => {
  if (!pattern) {
    throw new Error('Cant compile path. No pattern provided.');
  }

  if (cache[pattern]) { return cache[pattern]; }

  const keys = [];
  pathToRegexp(pattern, keys);

  if (cacheCount < cacheLimit) {
    cache[pattern] = keys;
    cacheCount++;
  }

  return keys;
};

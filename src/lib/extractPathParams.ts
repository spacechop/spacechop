import pathToRegexp from 'path-to-regexp';
import { parse } from 'url';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function getApplicablePath(pattern) {
  const parsed = parse(pattern);
  if (parsed.host) {
    return parsed.pathname;
  }

  return pattern;
}

export default (pattern) => {
  if (!pattern) {
    throw new Error('Cant compile path. No pattern provided.');
  }

  if (cache[pattern]) { return cache[pattern]; }

  const keys = [];

  pathToRegexp(getApplicablePath(pattern), keys);

  if (cacheCount < cacheLimit) {
    cache[pattern] = keys;
    cacheCount++;
  }

  return keys;
};

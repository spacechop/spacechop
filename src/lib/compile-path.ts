import pathToRegexp from 'path-to-regexp';

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

export default (pattern, parameters) => {
  if (!pattern) {
    throw new Error('Cant compile path. No pattern provided.');
  }

  if (cache[pattern]) {
    return cache[pattern](parameters)
      .replace(/%2F/g, '/'); // Support folders in s3 dynamically from the path.
  }

  const toPath = pathToRegexp.compile(pattern);

  if (cacheCount < cacheLimit) {
    cache[pattern] = toPath;
    cacheCount++;
  }

  return toPath(parameters)
    .replace(/%2F/g, '/'); // Support folders in s3 dynamically from the path.
};

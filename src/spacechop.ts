import pathToRegex from 'path-to-regexp';
import { Readable } from 'stream';
import Log from './log';
import Sources from './sources';
import transform from './transform';
import { Config } from './types/Config';
import { Source } from './types/Source';

const asyncWrapper = (fn) => (req, res) => {
  Promise
    .resolve(fn(req, res))
    .catch(handleError(res));
};

const handleError = (res) => (error) => {
  console.error(error);
  res.status(500);
  res.end(error.message);
};

// Extract named parameters from request.
const extractParams = (params, values) => {
  return params.reduce((acc, param, i) => Object.assign(acc, {
    [param.name]: values[i],
  }), {});
};

const lookThroughSources = async (sources, params): Promise<{ stream: Readable, source: Source }> => {
  for (const source of sources) {
    const name = Object.keys(source)[0];
    const props = source[name];

    // initialize source instance with config.
    const instance = new Sources[name](props);
    if (await instance.exists(params)) {
      return {
        stream: instance.stream(params),
        source,
      };
    }
  }
  return null;
};

export default (config: Config, server) => {
  if (!config) {
    return;
  }
  // extract paths from config to listen in on.
  const { sources, paths = ['/*'] } = config;

  // listen on all paths.
  paths.forEach((path) => {
    const keys = [];
    const pattern = pathToRegex(path, keys);
    server.get(pattern, asyncWrapper(async (req, res) => {
      const stdlog = new Log();
      // Extract params from request (enables the use of dynamic named params (.*)).
      const params = extractParams(keys, req.params);
      stdlog.log('request', req.originalUrl);

      // find the right preset steps to use
      const preset = config.presets[params.preset];

      if (!preset) {
        res.status(404);
        res.end('Could not find preset');
        stdlog.log(404, 'Could not find preset');
        stdlog.end();
        return;
      } else {
        stdlog.log('found preset', { [params.preset]: preset });
      }

      // look through sources to fetch original source stream
      stdlog.time('found image');
      const { stream, source } = await lookThroughSources(sources, params);

      if (!stream) {
        res.status(404);
        res.end('Could not find image');
        stdlog.clearTime('found image in source');
        stdlog.log(404, 'Could not find image');
        stdlog.end();
        return;
      } else {
        stdlog.time('found image');
        stdlog.log('in source', source);
      }

      stdlog.time('transform');
      const transformed = await transform(stream, preset.steps);

      // Send image data through the worker which passes through to response.
      transformed.pipe(res);
      transformed.on('end', () => {
        stdlog.time('transform');
        stdlog.end();
      });
    }));
  });
};

import { Request, Response } from 'express';
import pathToRegex from 'path-to-regexp';
import IStorage from './storage/storage';
import transform, { buildTransformation } from './transform';
import { Config } from './types/Config';
import { formatToMime, Mime } from './types/Format';
import StreamSwitch from './lib/stream-switch';
import instantiateStorage from './storage/lib/instantiate-storage';
import instantiateSource from './sources/lib/instantiate-source';
import Source from './sources/source';
import fetchFromStorage from './storage/lib/fetch-from-storage';
import lookThroughSources from './sources/lib/look-through-sources';
import uploadToStorage from './storage/lib/upload-to-storage';

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

export const requestHandler = (config: Config, keys, sources: Source[], storage?: IStorage) => async (req: Request, res: Response) => {
  // Extract params from request (enables the use of dynamic named params (.*)).
  const params = extractParams(keys, req.params);

  // find the right preset steps to use
  const preset = config.presets[params.preset];

  if (!preset) {
    res.status(404);
    res.end('Could not find preset');
    return;
  }

  // check if transformation is already done and exists in storage
  if (storage) {
    const fromCache = await fetchFromStorage(storage, params);
    // It exists in cache
    if (fromCache) {
      console.info('Serving image from cache');
      const { stream, contentType } = fromCache;
      if (contentType) {
        res.set('Content-Type', contentType);
        stream.pipe(res);
        return;
      }
    }
  }

  // look through sources to fetch original source stream
  const stream = await lookThroughSources(sources, params);

  if (!stream) {
    res.status(404);
    res.end('Could not find image');
    return;
  }

  // Only analyze image after pipeline
  const onlyAnalyze = 'analyze' in req.query;
  if (onlyAnalyze) {
    const { state } = await buildTransformation(stream, preset.steps);
    res.json(state);
  } else {
    const { stream: transformed, definition } = await transform(stream, preset.steps);
    const contentType = formatToMime(definition.type);
    res.set('Content-Type', contentType);
    // Send image data through the worker which passes through to response.
    
    let streamToRespondWith = transformed;
    if(config.storage) {
      const streamSwitch = new StreamSwitch(transformed);
      streamToRespondWith = streamSwitch.createReadStream();
      const streamToCache = streamSwitch.createReadStream();
      uploadToStorage(storage, params, streamToCache, contentType);
    }
    streamToRespondWith.pipe(res);
  }
}

export default (config: Config, server) => {
  if (!config) {
    return;
  }
  // extract paths from config to listen in on.
  const { paths = ['/*'] } = config;

  const storage = !!config.storage ? instantiateStorage(config.storage) : null;
  const sources = config.sources.map(instantiateSource);
  // listen on all paths.
  paths.forEach((path) => {
    const keys = [];
    const pattern = pathToRegex(path, keys);
    const handler = requestHandler(config, keys, sources, storage)
    server.get(pattern, asyncWrapper(handler));
  });
};

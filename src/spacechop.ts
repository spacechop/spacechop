import { Request, Response } from 'express';
import pathToRegex from 'path-to-regexp';
import { Readable, Stream } from 'stream';
import Sources from './sources';
import Storage from './storage';
import IStorage from './storage/storage';

import transform, { buildTransformation } from './transform';
import { Config } from './types/Config';
import { formatToMime, Mime } from './types/Format';
import StreamSwitch from './lib/stream-switch';

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

const lookThroughSources = async (sources, params): Promise<Readable> => {
  for (const source of sources) {
    const name = Object.keys(source)[0];
    const props = source[name];

    // initialize source instance with config.
    const instance = new Sources[name](props);
    if (await instance.exists(params)) {
      return instance.stream(params);
    }
  }
  return null;
};

const getStorageInstance = (storage): IStorage => {
  const name = Object.keys(storage)[0];
  const props = storage[name];
  const storageInstance: IStorage = new Storage[name](props);
  return storageInstance;
};
const transformationFromStorage = async (storage, params): Promise<{ stream: Stream, contentType?: Mime }> => {
  const storageInstance = getStorageInstance(storage);
  const exists = await storageInstance.exists(params);
  if (exists) {
    return storageInstance.stream(params);
  } else {
    return null;
  }
};

const transformationToStorage = async (storage, params, stream, contentType): Promise<void> => {
  const storageInstance = getStorageInstance(storage);
  return storageInstance.upload(params, stream, contentType);
}

export const requestHandler = (config: Config, keys) => async (req: Request, res: Response) => {
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
  if (config.storage) {
    const fromCache = await transformationFromStorage(config.storage, params);
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
  const stream = await lookThroughSources(config.sources, params);

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
      transformationToStorage(config.storage, params, streamToCache, contentType);
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

  // listen on all paths.
  paths.forEach((path) => {
    const keys = [];
    const pattern = pathToRegex(path, keys);
    const handler = requestHandler(config, keys)
    server.get(pattern, asyncWrapper(handler));
  });
};

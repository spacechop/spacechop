import { Request, Response } from 'express';
import pathToRegex from 'path-to-regexp';
import { Stream } from 'stream';
import console from './lib/console';
import extractParamValues from './lib/extractParamValues';
import populatePresetParams from './lib/populatePresetParams';
import asyncWrapper from './lib/requestAsyncWrapper';
import StreamSwitch from './lib/stream-switch';
import streamToBuffer from './lib/streamToBuffer';
import instantiateSource from './sources/lib/instantiate-source';
import lookThroughSources from './sources/lib/look-through-sources';
import Source from './sources/source';
import hash from './storage/hash';
import fetchFromStorage from './storage/lib/fetch-from-storage';
import instantiateStorage from './storage/lib/instantiate-storage';
import uploadToStorage from './storage/lib/upload-to-storage';
import IStorage from './storage/storage';
import Trace from './trace';
import transform, { buildTransformation } from './transform';
import { Config } from './types/Config';
import { formatToMime, Mime } from './types/Format';

export const handleError = (res) => (error) => {
  console.error(error);
  res.status(500);
  res.end(error.message);
};

export const respond = async (response: Response, stream: Stream, mime: Mime, config: Config) => {
  return new Promise(async (resolve, reject) => {
    response.set('Content-Type', mime);

    if (config.disableChunkedEncoding) {
      const buffer = await streamToBuffer(stream);
      response.set('Content-Length', `${buffer.length}`);
      // If content-length is set node will not set the transfer-encoding
      // so next line is not neccesary but leaving it here
      // since it is confusing.
      // response.set('Transfer-Encoding', '');
      response.end(buffer);
      resolve(buffer.length);
      return;
    }

    response.set('Transfer-Encoding', 'chunked');
    let size = 0;
    stream.pipe(response);
    stream.on('error', reject);
    stream.on('data', (chunk) => { size += chunk.length; });
    stream.on('end', () => resolve(size));
    return;
  });
};

export const requestHandler = (
  config: Config, keys,
  sources: Source[],
  storage?: IStorage,
  monitor?: any,
) => async (req: Request, res: Response) => {
  const handle = monitor && monitor.monitorResponse(res);
  // Create trace instance.
  const trace = new Trace();
  // Extract params from request (enables the use of dynamic named params (.*)).
  const params = extractParamValues(keys, req.params);
  trace.log('url', req.originalUrl);
  trace.log('params', params);

  // find the right preset steps to use
  const preset = config.presets[params.preset];

  if (!preset) {
    res.status(404);
    res.end('Could not find preset');
    trace.warn('preset', 'Could not find preset');
    return;
  } else {
    res.set('X-Preset', params.preset);
    trace.log('preset', preset);
  }

  // populate steps with params.
  const steps = populatePresetParams(preset.steps, params);
  trace.log('steps', steps);
  if (storage) {
    params.hash = hash(steps);
  }

  // check if transformation is already done and exists in storage
  if (storage) {
    const fromCache = await fetchFromStorage(storage, params);

    // It exists in cache
    if (fromCache && fromCache.contentType) {
      if ('analyze' in req.query) {
        const { state } = await buildTransformation(fromCache.stream, steps);
        res.json(state);
        return;
      }

      res.set('X-Cache', 'HIT');
      res.set('X-Key', fromCache.key);
      await respond(res, fromCache.stream, fromCache.contentType, config);
      trace.end();
      return;
    }
  }

  // look through sources to fetch original source stream
  const fromSource = await lookThroughSources(sources, params);

  // It does not exist in source
  if (fromSource && !fromSource.stream) {
    res.status(404);
    res.end('Could not find image');
    trace.warn('image', 'Could not find image');
    return;
  } else {
    res.set('X-Key', fromSource.key);
    trace.log('original', fromSource.key);
  }

  // Only analyze image after pipeline
  const onlyAnalyze = 'analyze' in req.query;
  if (onlyAnalyze) {
    const { state } = await buildTransformation(fromSource.stream, steps);
    trace.log('analyze', state);
    res.json(state);
    trace.end();
  } else {
    try {
      const fromTransform = await transform(fromSource.stream, steps);
      trace.log('definition', fromTransform.definition);
      const contentType = formatToMime(fromTransform.definition.type);
      res.set('X-Cache', 'MISS');

      // Send image data through the worker which passes through to response.
      let streamToRespondWith = fromTransform.stream;
      if (storage) {
        const streamSwitch = new StreamSwitch(fromTransform.stream);
        streamToRespondWith = streamSwitch.createReadStream();
        const streamToCache = streamSwitch.createReadStream();
        uploadToStorage(storage, params, streamToCache, contentType);
      }
      const size = await respond(res, streamToRespondWith, contentType, config);
      trace.log('size', size);
      trace.end();
      if (handle) {
        handle.close(size);
      }
    } catch (err) {
      trace.warn('error', err);
    }
  }
};

export default (
  config: Config,
  server: any,
  monitor?: any,
) => {
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
    const handler = requestHandler(config, keys, sources, storage, monitor);
    server.get(pattern, asyncWrapper(handler, handleError));
  });
};

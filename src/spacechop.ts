import { spawn } from 'duplex-child-process';
import pathToRegex from 'path-to-regexp';
import { Stream } from 'stream';
import ImageDefinition, { ImageType } from './imagedef';
import Operations from './operations';
import Sources from './sources';

const lookThroughSources = async (sources, params): Promise<Stream> => {
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

const initializePipeline = (steps) => {
  let requirements = {};
  const preparedSteps = steps.map((step) => {
    const name = Object.keys(step)[0];
    const props = step[name];

    if (!Operations[name]) {
      console.error('Operation');
      throw new Error(
        `Operation ${name} was not found. \n\n` +
        `Available operations are [${Object.keys(Operations)}]`,
      );
    }
    // initialize operation instance with config.
    const instance = new Operations[name](props);
    // prepare requirements from steps
    requirements = {
      ...requirements,
      ...instance.requirements(),
    };
    return instance;
  });

  return { pipeline: preparedSteps, requirements };
};

const buildImageDefinition = async (stream, requirements): Promise<ImageDefinition> => {
    // XXX in case of face detection, analyze image for faces

  return {
    width: 2000,
    height: 1495,
    type: ImageType.png,
  };
};

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

const simulateTransformation = (pipeline, initialState) => {

  // const { command } = steps.reduce((acc, operation) => {
  //   const name = Object.keys(operation)[0];
  //   return operations[name].execute();
  // }, { command: '', state });
  let currentState = initialState;
  const commands = [];
  for (const operation of pipeline) {
    const { command, state } = operation.execute(currentState);
    commands.push(command);
    currentState = state;
  }
  return { commands, state: currentState };
};

// Extract named parameters from request.
const extractParams = (params, values) => {
  return params.reduce((acc, param, i) => Object.assign(acc, {
    [param.name]: values[i],
  }), {});
};

export default (config, server) => {
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
      // Extract params from request (enables the use of dynamic named params (.*)).
      const params = extractParams(keys, req.params);

      // find the right preset steps to use
      const preset = config.presets[params.preset];

      if (!preset) {
        res.status(404);
        res.end('Could not find preset');
        return;
      }

      // look through sources to fetch original source stream
      const stream = await lookThroughSources(sources, params);

      if (!stream) {
        res.status(404);
        res.end('Could not find image');
        return;
      }

      // initialize steps
      const { pipeline, requirements } = initializePipeline(preset.steps);

      // prepare the image definition
      const definition = await buildImageDefinition(stream, requirements);

      // build command from pipeline and image state
      const { commands } = simulateTransformation(pipeline, definition);

      // Spawn new worker to work through the commands.
      const worker = spawn('sh', ['-c', commands.join(' | ')]);

      // Send image data through the worker which passes through to response.
      stream.pipe(worker).pipe(res);
    }));
  });
};

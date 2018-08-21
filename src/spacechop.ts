import { spawn } from 'duplex-child-process';
import pathToRegex from 'path-to-regexp';
import { Readable, Stream } from 'stream';
import ImageDefinition from './imagedef';
import analyze from './imagedef/analyze';
import StreamSwitch from './lib/stream-switch';
import Operations from './operations';
import Sources from './sources';

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

export const transform = async (stream: Readable, steps: any[]): Promise<Readable> => {
  if (steps.length === 0) {
    return stream;
  }

  const streamSwitch = new StreamSwitch(stream);
  const streamToAnalyze = streamSwitch.createReadStream();
  const streamToTransform = streamSwitch.createReadStream();

  // initialize steps
  const { pipeline, requirements } = initializePipeline(steps);

  // prepare the image definition
  const definition: ImageDefinition = await analyze(streamToAnalyze, requirements);

  // build command from pipeline and image state
  const { commands } = simulateTransformation(pipeline, definition);

  // Spawn new worker to work through the commands.
  const worker = spawn('sh', ['-c', commands.join(' | ')]);
  streamToTransform.pipe(worker);
  return worker;
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

      const transformed = await transform(stream, preset.steps);

      // Send image data through the worker which passes through to response.
      transformed.pipe(res);
    }));
  });
};

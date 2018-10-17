import { spawn } from 'duplex-child-process';
import { Stream } from 'stream';
import { Params } from '../config/params';
import analyze from '../lib/analyze';
import StreamSwitch from '../lib/stream-switch';
import fetchExtraSources from '../sources/lib/fetch-extra-sources';
import SourceInstances from '../sources/sources';
import { Config, ImageDefinition, Step } from '../types';
import initializePipeline from './initialize-pipeline';
import joinCommands from './join-commands';
import simulateTransformation from './simulate-transformation';

export interface TransformationResult {
  stream: Stream;
  definition: ImageDefinition;
}

export const buildTransformation = async (
  stream: Stream,
  steps: Step[],
  config?: Config,
  sources?: SourceInstances,
  params?: Params,
) => {
  // initialize steps
  const {
    pipeline,
    requirements,
  } = initializePipeline(steps);

  const definition: ImageDefinition = await analyze(stream, requirements);

  // build command from pipeline and image state
  const simulation = simulateTransformation(pipeline, definition);

  if ('sources' in simulation.extra && sources) {
    await fetchExtraSources(simulation.extra.sources, config, sources, params);
  }

  return simulation;
};

export default async (
  input: Stream,
  steps: Step[],
  config?: Config,
  sources?: SourceInstances,
  params?: Params,
): Promise<TransformationResult> => {
  const streamSwitch = new StreamSwitch(input);
  const streamToAnalyze = streamSwitch.createReadStream();
  const streamToTransform = streamSwitch.createReadStream();

  // build command from pipeline and image state
  const { commands, state } =
    await buildTransformation(streamToAnalyze, steps, config, sources, params);

  // do nothing when no steps.
  if (steps.length === 0) {
    return { stream: streamToTransform, definition: state };
  }

  // Spawn new worker to work through the commands.
  const finalCommand = joinCommands(commands);
  const stream = spawn('sh', ['-c', finalCommand]);
  stream.on('error', (err) => { throw err; });
  streamToTransform.pipe(stream);
  return { stream, definition: state };
};

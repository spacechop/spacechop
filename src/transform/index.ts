import { spawn } from 'duplex-child-process';
import { Stream } from 'stream';
import { Params } from '../config/params';
import analyze from '../lib/analyze';
import StreamSwitch from '../lib/stream-switch';
import fetchExtraSources from '../sources/lib/fetch-extra-sources';
import SourceInstances from '../sources/sources';
import { ImageDefinition, Step } from '../types';
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
  sources?: SourceInstances,
  params?: Params,
) => {
  // initialize steps
  const {
    pipeline,
    requirements,
  } = initializePipeline(steps);

  const definition: ImageDefinition = await analyze(stream, requirements);
  if ('sources' in requirements && sources) {
    await fetchExtraSources(requirements.sources, sources, params);
  }

  // build command from pipeline and image state
  return simulateTransformation(pipeline, definition);
};

export default async (
  input: Stream,
  steps: Step[],
  sources?: SourceInstances,
  params?: Params,
): Promise<TransformationResult> => {
  const streamSwitch = new StreamSwitch(input);
  const streamToAnalyze = streamSwitch.createReadStream();
  const streamToTransform = streamSwitch.createReadStream();

  // build command from pipeline and image state
  const { commands, state } =
    await buildTransformation(streamToAnalyze, steps, sources, params);

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

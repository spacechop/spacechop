import { spawn } from 'duplex-child-process';
import { Readable } from 'stream';
import { Operation } from '../types/Operation';
import ImageDefinition from './../imagedef';
import analyze from './../imagedef/analyze';
import StreamSwitch from './../lib/stream-switch';
import buildHeaders, { TransformationHeaders } from './build-headers';
import initializePipeline from './initialize-pipeline';
import joinCommands from './join-commands';
import simulateTransformation from './simulate-transformation';


export interface TransformationResult {
  stream: Readable;
  headers: TransformationHeaders;
}

export const buildTransformation = async (
  stream: Readable,
  steps: Operation[],
  definition: ImageDefinition = await analyze(stream, requirements),
) => {
  // initialize steps
  const { pipeline, requirements } = initializePipeline(steps);

  // build command from pipeline and image state
  return simulateTransformation(pipeline, definition);
};

const transform = async (input: Readable, steps: Operation[]): Promise<{
  stream: Readable,
  definition: ImageDefinition,
}> => {
  const streamSwitch = new StreamSwitch(input);
  const streamToAnalyze = streamSwitch.createReadStream();
  const streamToTransform = streamSwitch.createReadStream();

  // initialize steps
  const { pipeline, requirements } = initializePipeline(steps);

  // prepare the image definition
  const definition: ImageDefinition = await analyze(streamToAnalyze, requirements);

  // do nothing when no steps.
  if (steps.length === 0) {
    return { stream: streamToTransform, definition };
  }

  // build command from pipeline and image state
  const { commands } = await buildTransformation(streamToAnalyze, steps, definition);

  // Spawn new worker to work through the commands.
  const finalCommand = joinCommands(commands);
  const stream = spawn('sh', ['-c', finalCommand]);
  streamToTransform.pipe(stream);
  return { stream, definition };
};

export default async (input: Readable, steps: Operation[]): Promise<TransformationResult> => {
  const output = await transform(input, steps);
  const { stream, definition } = output;
  const streamSwitch = new StreamSwitch(stream);

  const headers = await buildHeaders(streamSwitch.createReadStream(), definition);

  return {
    stream: streamSwitch.createReadStream(),
    headers,
  };
};

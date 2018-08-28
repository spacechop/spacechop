import { spawn } from 'duplex-child-process';
import { Readable } from 'stream';
import { Operation } from '../types/Operation';
import ImageDefinition from './../imagedef';
import analyze from './../imagedef/analyze';
import StreamSwitch from './../lib/stream-switch';
import initializePipeline from './initialize-pipeline';
import joinCommands from './join-commands';
import simulateTransformation from './simulate-transformation';


export interface TransformationResult {
  stream: Readable;
  definition: ImageDefinition;
}

export const buildTransformation = async (
  stream: Readable,
  steps: Operation[],
) => {
  // initialize steps
  const { pipeline, requirements } = initializePipeline(steps);
  const definition: ImageDefinition = await analyze(stream, requirements);

  // build command from pipeline and image state
  return simulateTransformation(pipeline, definition);
};

export default async (input: Readable, steps: Operation[]): Promise<TransformationResult> => {
  const streamSwitch = new StreamSwitch(input);
  const streamToAnalyze = streamSwitch.createReadStream();
  const streamToTransform = streamSwitch.createReadStream();
  
  // build command from pipeline and image state
  const { commands, state } = await buildTransformation(streamToAnalyze, steps);

  // do nothing when no steps.
  if (steps.length === 0) {
    return { stream: streamToTransform, definition: state };
  }
  
  // Spawn new worker to work through the commands.
  const finalCommand = joinCommands(commands);
  const stream = spawn('sh', ['-c', finalCommand]);
  streamToTransform.pipe(stream);
  return { stream, definition: state };
};

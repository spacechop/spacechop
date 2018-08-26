import { spawn } from 'duplex-child-process';
import { Readable } from 'stream';
import { Operation } from '../types/Operation';
import ImageDefinition from './../imagedef';
import analyze from './../imagedef/analyze';
import StreamSwitch from './../lib/stream-switch';
import initializePipeline from './initialize-pipeline';
import joinCommands from './join-commands';
import simulateTransformation from './simulate-transformation';

export const buildTransformation = async (stream: Readable, steps: Operation[]) => {
  // initialize steps
  const { pipeline, requirements } = initializePipeline(steps);

  // prepare the image definition
  const definition: ImageDefinition = await analyze(stream, requirements);

  // build command from pipeline and image state
  return simulateTransformation(pipeline, definition);
};

export default async (stream: Readable, steps: Operation[]): Promise<Readable> => {
  if (steps.length === 0) {
    return stream;
  }

  const streamSwitch = new StreamSwitch(stream);
  const streamToAnalyze = streamSwitch.createReadStream();
  const streamToTransform = streamSwitch.createReadStream();
  const { commands } = await buildTransformation(streamToAnalyze, steps);

  // Spawn new worker to work through the commands.
  const finalCommand = joinCommands(commands);
  const worker = spawn('sh', ['-c', finalCommand]);
  streamToTransform.pipe(worker);
  return worker;
};

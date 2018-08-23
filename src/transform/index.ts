import { spawn } from 'duplex-child-process';
import { Readable } from 'stream';
import { Operation } from '../types/Operation';
import ImageDefinition from './../imagedef';
import analyze from './../imagedef/analyze';
import StreamSwitch from './../lib/stream-switch';
import initializePipeline from './initialize-pipeline';
import joinCommands from './join-commands';
import simulateTransformation from './simulate-transformation';


export default async (stream: Readable, steps: Operation[]): Promise<Readable> => {
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
  const finalCommand = joinCommands(commands);
  const worker = spawn('sh', ['-c', finalCommand]);
  streamToTransform.pipe(worker);
  return worker;
};

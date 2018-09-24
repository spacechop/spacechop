import { spawn } from 'duplex-child-process';
import { Stream } from 'stream';
import { DefinitionRequirement } from '../types/DefinitionRequirement';
import { Step } from '../types/Step';
import ImageDefinition from './../imagedef';
import analyze from './../imagedef/analyze';
import StreamSwitch from './../lib/stream-switch';
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
  detect: DefinitionRequirement[] = [],
) => {
  // initialize steps
  const {
    pipeline,
    requirements,
  } = initializePipeline(steps);
  const definition: ImageDefinition =
    await analyze(stream, {...requirements, ...detect });

  // build command from pipeline and image state
  return simulateTransformation(pipeline, definition);
};

export default async (
  input: Stream,
  steps: Step[],
  detect: DefinitionRequirement[] = [],
): Promise<TransformationResult> => {
  const streamSwitch = new StreamSwitch(input);
  const streamToAnalyze = streamSwitch.createReadStream();
  const streamToTransform = streamSwitch.createReadStream();

  // build command from pipeline and image state
  const { commands, state } =
    await buildTransformation(streamToAnalyze, steps, detect);

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

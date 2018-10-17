import deepmerge from 'deepmerge';
import Operation from '../operations/operation';
import { DefinitionRequirement, ImageDefinition, Step } from '../types';
import Operations from './../operations';

interface InitalizedPipeline {
  pipeline: Operation[];
  prerequisites: DefinitionRequirement;
}

export default (steps: Step[], state: ImageDefinition): InitalizedPipeline => {
  let prerequisites = {};
  const preparedSteps = steps.map((step: Step): Operation => {
    const name = Object.keys(step)[0];
    const props = step[name];

    if (!Operations[name]) {
      throw new Error(
        `Operation ${name} was not found. \n\n` +
        `Available operations are [${Object.keys(Operations)}]`,
      );
    }
    // initialize operation instance with config.
    const instance: Operation = new Operations[name](props);
    // prepare requirements from steps
    prerequisites = deepmerge(prerequisites, instance.prerequisites(state));
    return instance;
  });

  return {
    pipeline: preparedSteps,
    prerequisites,
  };
};

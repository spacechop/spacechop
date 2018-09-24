import { DefinitionRequirement } from '../imagedef';
import Operations from './../operations';

interface InitalizedPipeline {
  pipeline: any;
  requirements: {
    [K in DefinitionRequirement]?: boolean;
  };
}

export default (steps): InitalizedPipeline => {
  let requirements = {};
  const preparedSteps = steps.map((step) => {
    const name = Object.keys(step)[0];
    const props = step[name];

    if (!Operations[name]) {
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

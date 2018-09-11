import Operations from './../operations';

export default (steps) => {
  let requirements = [];
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
    requirements = [
      ...requirements,
      ...instance.requirements(),
    ];
    return instance;
  });

  return { pipeline: preparedSteps, requirements };
};

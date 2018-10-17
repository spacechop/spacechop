import deepmerge from 'deepmerge';
import { PreprocessRequirements } from '../types/PreprocessRequirements';

export default (pipeline, initialState) => {
  let currentState = initialState;
  const commands = [];
  let postrequisites: PreprocessRequirements = {};
  for (const operation of pipeline) {
    const op = operation.execute(currentState);
    commands.push(op.command);
    const postrequisite = operation.postrequisite(currentState);
    postrequisites = deepmerge(postrequisites, postrequisite);
    currentState = op.state;
  }
  const simulation = { commands, state: currentState };
  return {
    simulation,
    postrequisites,
  };
};

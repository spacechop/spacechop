import deepmerge from 'deepmerge';
import { ExtraRequirement } from '../types/ExtraRequirement';

export default (pipeline, initialState) => {
  let currentState = initialState;
  const commands = [];
  let extra: ExtraRequirement = {};
  for (const operation of pipeline) {
    const op = operation.execute(currentState);
    commands.push(op.command);
    extra = deepmerge(extra, op.extra || {});
    currentState = op.state;
  }
  return { commands, state: currentState, extra };
};

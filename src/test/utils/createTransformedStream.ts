import { spawn } from 'duplex-child-process';
import fs from 'fs';
import ImageDefinition from '../../imagedef';
import Operation from '../../operations/operation';


export default (
  sourceImagePath: string,
  operation: Operation | Operation[],
  initialState: ImageDefinition,
): NodeJS.ReadableStream => {
  const operations = Array.isArray(operation) ? operation : [operation];
  const source = fs.createReadStream(sourceImagePath);
  let state = initialState;
  const commands = [];
  for (const op of operations) {
    const { command, state: newState } = op.execute(state);
    commands.push(command);
    state = newState;
  }

  const transformation = spawn('sh', ['-c', commands.join(' | ')]);
  source.pipe(transformation);
  return transformation;
};

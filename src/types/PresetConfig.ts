import * as t from 'runtypes';
import Operation from './Operation';

export default t.Record({
  steps: t.Array(Operation),
});

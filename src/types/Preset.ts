import * as t from 'runtypes';
import Step from './Step';

const Preset = t.Record({
  steps: t.Array(Step),
});

export type Preset = t.Static<typeof Preset>;
export default Preset;

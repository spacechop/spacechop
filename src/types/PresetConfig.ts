import * as t from 'runtypes';
import Requirements from './Requirements';
import Step from './Step';

const PresetConfig = t.Record({
  steps: t.Array(Step),
}).And(t.Partial({
  requirements: t.Array(Requirements),
}));

export type PresetConfig = t.Static<typeof PresetConfig>;
export default PresetConfig;

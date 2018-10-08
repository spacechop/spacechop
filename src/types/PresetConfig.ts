import * as t from 'runtypes';
import Step from './Step';

const PresetConfig = t.Record({
  steps: t.Array(Step),
});

export type PresetConfig = t.Static<typeof PresetConfig>;
export default PresetConfig;

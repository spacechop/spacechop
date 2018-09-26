import * as t from 'runtypes';
import DefinitionRequirement from './DefinitionRequirement';
import Step from './Step';

const PresetConfig = t.Record({
  steps: t.Array(Step),
});

export type PresetConfig = t.Static<typeof PresetConfig>;
export default PresetConfig;

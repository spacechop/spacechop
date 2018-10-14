import * as t from 'runtypes';
import ExtraSource from './ExtraSource';

const DefinitionRequirement = t.Partial({
  faces: t.Boolean,
  sources: t.Array(ExtraSource),
});

export type DefinitionRequirement = t.Static<typeof DefinitionRequirement>;

export default DefinitionRequirement;

import * as t from 'runtypes';

const DefinitionRequirement = t.Partial({
  faces: t.Boolean,
  profile: t.Boolean,
});

export type DefinitionRequirement = t.Static<typeof DefinitionRequirement>;

export default DefinitionRequirement;

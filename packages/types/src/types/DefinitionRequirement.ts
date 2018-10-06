import * as t from 'runtypes';

const DefinitionRequirement = t.Union(
  t.Literal('faces'),
);

export type DefinitionRequirement = t.Static<typeof DefinitionRequirement>;

export default DefinitionRequirement;

import * as t from 'runtypes';

const DefinitionRequirement = t.Union(
  t.Literal('faces'),
  t.Literal('exif'),
);

export type DefinitionRequirement = t.Static<typeof DefinitionRequirement>;

export default DefinitionRequirement;

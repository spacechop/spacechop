import * as t from 'runtypes';

const DefinitionRequirement = t.Union(
  t.Literal('faces'),
);

export type DefinitionRequirement = t.Static<typeof DefinitionRequirement>;

export const allDefinitionRequirements =
  DefinitionRequirement.alternatives.map((f) => f.value);

const Requirements = t.Partial(
  allDefinitionRequirements.reduce((acc, req) => ({
    ...acc,
    [req]: t.Boolean,
  }), {}),
);

export type Requirements = t.Static<typeof DefinitionRequirement>;

export default Requirements;

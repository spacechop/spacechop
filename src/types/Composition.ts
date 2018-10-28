import * as t from 'runtypes';

const Composition = t.Union(
  t.Literal('before'),
  t.Literal('after'),
);

export const allComposition = Composition.alternatives.map((f) => f.value);
export type Composition = t.Static<typeof Composition>;
export default Composition;

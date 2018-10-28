import * as t from 'runtypes';

const Blending = t.Union(
  t.Literal('multiply'),
  t.Literal('overlay'),
);

export const allBlending = Blending.alternatives.map((f) => f.value);
export type Blending = t.Static<typeof Blending>;
export default Blending;

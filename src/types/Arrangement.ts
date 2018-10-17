import * as t from 'runtypes';

const Arrangement = t.Union(
  t.Literal('under'),
  t.Literal('over'),
);

export const allArrangement = Arrangement.alternatives.map((f) => f.value);
export type Arrangement = t.Static<typeof Arrangement>;
export default Arrangement;

import * as t from 'runtypes';

const Gravity = t.Union(
  t.Literal('center'),
  t.Literal('face'),

  t.Literal('north'),
  t.Literal('northeast'),
  t.Literal('east'),
  t.Literal('southeast'),
  t.Literal('south'),
  t.Literal('southwest'),
  t.Literal('west'),
  t.Literal('northwest'),
);

export const allGravities = Gravity.alternatives.map((f) => f.value);
export type Gravity = t.Static<typeof Gravity>;
export default Gravity;

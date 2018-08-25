import * as t from 'runtypes';

const Mime = t.Union(
  t.Literal('image/jpeg'),
  t.Literal('image/png'),
  t.Literal('image/gif'),
  t.Literal('image/webp'),
  t.Literal('application/json'), // available for $report operations.
);

export const allMimes = Mime.alternatives.map((f) => f.value);
export type Mime = t.Static<typeof Mime>;
export default Mime;

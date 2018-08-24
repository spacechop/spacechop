import * as t from 'runtypes';

const Format = t.Union(
  t.Literal('json'),
);

export const allFormats = Format.alternatives.map((f) => f.value);
export type Format = t.Static<typeof Format>;
export default Format;

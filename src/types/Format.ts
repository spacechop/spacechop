import * as t from 'runtypes';

const Format = t.Union(
  t.Literal('jpeg'),
  t.Literal('png'),
  t.Literal('gif'),
  t.Literal('webp'),
);

export const allFormats = Format.alternatives.map((f) => f.value);
export type Format = t.Static<typeof Format>;
export default Format;

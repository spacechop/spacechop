import * as t from 'runtypes';

export default t.Union(
  t.Literal('jpeg'),
  t.Literal('png'),
  t.Literal('gif'),
  t.Literal('webp'),
);

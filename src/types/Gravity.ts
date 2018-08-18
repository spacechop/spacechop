import * as t from 'runtypes';

export default t.Union(
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

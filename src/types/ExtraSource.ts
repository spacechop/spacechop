import * as t from 'runtypes';

const ExtraSource = t.Record({
  source: t.String,
  handle: t.String,
}).And(t.Partial({
  params: t.Dictionary(t.String, 'string'),
}));

export type ExtraSource = t.Static<typeof ExtraSource>;

export default ExtraSource;

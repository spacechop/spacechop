import * as t from 'runtypes';

const ComposeConfig = t.Record({
  source: t.String,
}).And(t.Partial({
  params: t.Dictionary(t.String, 'string'),
}));

export type ComposeConfig = t.Static<typeof ComposeConfig>;
export default ComposeConfig;

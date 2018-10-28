import * as t from 'runtypes';

const LookupParamsConfig = t.Record({
  source: t.String,
}).And(t.Partial({
  params: t.Dictionary(t.String, 'string'),
  extract_from_json: t.Dictionary(t.String, 'string'),
}));

export type LookupParamsConfig = t.Static<typeof LookupParamsConfig>;
export default LookupParamsConfig;

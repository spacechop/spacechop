import * as t from 'runtypes';

const HttpSourceConfig = t.Record({
  root: t.String.withConstraint((n) => n && n.length > 0 || 'Requires valid url'),
});

export type HttpSourceConfig = t.Static<typeof HttpSourceConfig>;
export default HttpSourceConfig;

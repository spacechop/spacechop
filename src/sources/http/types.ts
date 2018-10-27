import * as t from 'runtypes';

const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

const HttpSourceConfig = t.Record({
  root: t.String.withConstraint(
    (n) => (n && n.length > 0 && pattern.test(n)) || 'Requires valid url',
  ),
});

export type HttpSourceConfig = t.Static<typeof HttpSourceConfig>;
export default HttpSourceConfig;

import * as t from 'runtypes';

const S3SourceConfig = t.Record({
    access_key_id: t.String.withConstraint((n) => n && n.length > 0),
    secret_access_key: t.String.withConstraint((n) => n && n.length > 0),
    region: t.String.withConstraint((n) => n && n.length > 0),
    bucket_name: t.String.withConstraint((n) => n && n.length > 0),
    path: t.String,
}).And(t.Partial({
  endpoint: t.String,
}));


export type S3SourceConfig = t.Static<typeof S3SourceConfig>;
export default S3SourceConfig;

import * as t from 'runtypes';

const ACL = t.Union(
  t.Literal('private'),
  t.Literal('public-read'),
  t.Literal('public-read-write'),
  t.Literal('authenticated-read'),
  t.Literal('aws-exec-read'),
  t.Literal('bucket-owner-read'),
  t.Literal('bucket-owner-full-control'),
);

const S3StorageConfig = t.Record({
    access_key_id: t.String.withConstraint((n) => n && n.length > 0),
    secret_access_key: t.String.withConstraint((n) => n && n.length > 0),
    region: t.String.withConstraint((n) => n && n.length > 0),
    bucket_name: t.String.withConstraint((n) => n && n.length > 0),
    path: t.String,
}).And(t.Partial({
    ACL,
    endpoint: t.String,
}));

export type S3StorageConfig = t.Static<typeof S3StorageConfig>;
export default S3StorageConfig;




import * as t from 'runtypes';

export default t.Record({
  s3: t.Record({
    access_key_id: t.String.withConstraint(n => n && n.length > 0),
    secret_access_key: t.String.withConstraint(n => n && n.length > 0),
    region: t.String.withConstraint(n => n && n.length > 0),
    bucket_name: t.String.withConstraint(n => n && n.length > 0),
    path: t.String,
  }),
});

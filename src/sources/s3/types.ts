import * as t from 'runtypes';

const RuntypeS3Config = t.Record({
  s3: t.Record({
    access_key_id: t.String.withConstraint((n) => n && n.length > 0),
    secret_access_key: t.String.withConstraint((n) => n && n.length > 0),
    region: t.String.withConstraint((n) => n && n.length > 0),
    bucket_name: t.String.withConstraint((n) => n && n.length > 0),
    path: t.String,
  }),
});

export interface S3Config {
  access_key_id: string;
  secret_access_key: string;
  region: string;
  bucket_name: string;
  path: string;
}

export default RuntypeS3Config;




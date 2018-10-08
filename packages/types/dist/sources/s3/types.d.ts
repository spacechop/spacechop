import * as t from 'runtypes';
declare const S3SourceConfig: t.Intersect2<t.Record<{
    access_key_id: t.Constraint<t.String, {}>;
    secret_access_key: t.Constraint<t.String, {}>;
    region: t.Constraint<t.String, {}>;
    bucket_name: t.Constraint<t.String, {}>;
    path: t.String;
}>, t.Part<{
    endpoint: t.String;
}>>;
export declare type S3SourceConfig = t.Static<typeof S3SourceConfig>;
export default S3SourceConfig;

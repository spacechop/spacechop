import * as t from 'runtypes';
declare const Storage: t.Union1<t.Record<{
    s3: t.Intersect2<t.Record<{
        access_key_id: t.Constraint<t.String, {}>;
        secret_access_key: t.Constraint<t.String, {}>;
        region: t.Constraint<t.String, {}>;
        bucket_name: t.Constraint<t.String, {}>;
        path: t.String;
    }>, t.Part<{
        ACL: t.Union7<t.Literal<"private">, t.Literal<"public-read">, t.Literal<"public-read-write">, t.Literal<"authenticated-read">, t.Literal<"aws-exec-read">, t.Literal<"bucket-owner-read">, t.Literal<"bucket-owner-full-control">>;
        endpoint: t.String;
    }>>;
}>>;
export declare type Storage = t.Static<typeof Storage>;
export default Storage;

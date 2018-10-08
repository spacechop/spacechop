import * as t from 'runtypes';
declare const Source: t.Union3<t.Record<{
    http: t.Record<{
        root: t.Constraint<t.String, {}>;
    }>;
}>, t.Record<{
    s3: t.Intersect2<t.Record<{
        access_key_id: t.Constraint<t.String, {}>;
        secret_access_key: t.Constraint<t.String, {}>;
        region: t.Constraint<t.String, {}>;
        bucket_name: t.Constraint<t.String, {}>;
        path: t.String;
    }>, t.Part<{
        endpoint: t.String;
    }>>;
}>, t.Record<{
    volume: t.Record<{
        root: t.Constraint<t.String, {}>;
    }>;
}>>;
export declare type Source = t.Static<typeof Source>;
export default Source;

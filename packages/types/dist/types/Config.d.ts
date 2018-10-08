import * as t from 'runtypes';
declare const Config: t.Constraint<t.Intersect2<t.Record<{
    paths: t.Constraint<t.Array<t.Constraint<t.Constraint<t.Constraint<t.String, {}>, {}>, {}>>, {}>;
    sources: t.Array<t.Union3<t.Record<{
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
    }>>>;
    presets: t.StringDictionary<t.Record<{
        steps: t.Array<t.Constraint<t.Part<{
            $compress: t.Part<{
                quality: t.Constraint<t.Number, {}>;
                lossy: t.Boolean;
            }>;
            $crop: t.Constraint<t.Part<{
                width: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
                    from_path: t.String;
                }>>;
                height: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
                    from_path: t.String;
                }>>;
                gravity: t.Union2<t.Union10<t.Literal<"center">, t.Literal<"face">, t.Literal<"north">, t.Literal<"northeast">, t.Literal<"east">, t.Literal<"southeast">, t.Literal<"south">, t.Literal<"southwest">, t.Literal<"west">, t.Literal<"northwest">>, t.Record<{
                    from_path: t.String;
                }>>;
            }>, {}>;
            $fill: t.Intersect2<t.Record<{
                width: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
                    from_path: t.String;
                }>>;
                height: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
                    from_path: t.String;
                }>>;
            }>, t.Part<{
                gravity: t.Union2<t.Union10<t.Literal<"center">, t.Literal<"face">, t.Literal<"north">, t.Literal<"northeast">, t.Literal<"east">, t.Literal<"southeast">, t.Literal<"south">, t.Literal<"southwest">, t.Literal<"west">, t.Literal<"northwest">>, t.Record<{
                    from_path: t.String;
                }>>;
            }>>;
            $fit: t.Constraint<t.Part<{
                width: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
                    from_path: t.String;
                }>>;
                height: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
                    from_path: t.String;
                }>>;
            }>, {}>;
            $format: t.Record<{
                type: t.Union2<t.Union4<t.Literal<"jpeg">, t.Literal<"png">, t.Literal<"gif">, t.Literal<"webp">>, t.Record<{
                    from_path: t.String;
                }>>;
            }>;
            $resize: t.Record<{
                width: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
                    from_path: t.String;
                }>>;
                height: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
                    from_path: t.String;
                }>>;
            }>;
            $strip: t.Part<{
                icc_profile: t.Boolean;
            }>;
        }>, {}>>;
    }>>;
}>, t.Part<{
    storage: t.Union1<t.Record<{
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
    disableChunkedEncoding: t.Boolean;
}>>, {}>;
export declare type Config = t.Static<typeof Config>;
export default Config;

declare const _default: (filename?: string) => {
    paths: string[];
    sources: import("runtypes/lib/types/union").Static3<import("runtypes/lib/types/record").Record<{
        http: import("runtypes/lib/types/record").Record<{
            root: import("runtypes/lib/types/constraint").Constraint<import("runtypes/lib/types/string").String, {}>;
        }>;
    }>, import("runtypes/lib/types/record").Record<{
        s3: import("runtypes/lib/types/intersect").Intersect2<import("runtypes/lib/types/record").Record<{
            access_key_id: import("runtypes/lib/types/constraint").Constraint<import("runtypes/lib/types/string").String, {}>;
            secret_access_key: import("runtypes/lib/types/constraint").Constraint<import("runtypes/lib/types/string").String, {}>;
            region: import("runtypes/lib/types/constraint").Constraint<import("runtypes/lib/types/string").String, {}>;
            bucket_name: import("runtypes/lib/types/constraint").Constraint<import("runtypes/lib/types/string").String, {}>;
            path: import("runtypes/lib/types/string").String;
        }>, import("runtypes/lib/types/partial").Part<{
            endpoint: import("runtypes/lib/types/string").String;
        }>>;
    }>, import("runtypes/lib/types/record").Record<{
        volume: import("runtypes/lib/types/record").Record<{
            root: import("runtypes/lib/types/constraint").Constraint<import("runtypes/lib/types/string").String, {}>;
        }>;
    }>>[];
    presets: {
        [_: string]: any;
    };
} & {
    storage?: {
        s3: any & any;
    };
    disableChunkedEncoding?: boolean;
};
export default _default;

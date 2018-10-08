import * as t from 'runtypes';
declare const Step: t.Constraint<t.Part<{
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
}>, {}>;
export declare type Step = t.Static<typeof Step>;
export default Step;

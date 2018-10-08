import * as t from 'runtypes';
declare const CropConfig: t.Constraint<t.Part<{
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
export declare type CropConfig = t.Static<typeof CropConfig>;
export default CropConfig;

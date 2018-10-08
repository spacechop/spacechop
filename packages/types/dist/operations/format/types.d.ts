import * as t from 'runtypes';
declare const FormatConfig: t.Record<{
    type: t.Union2<t.Union4<t.Literal<"jpeg">, t.Literal<"png">, t.Literal<"gif">, t.Literal<"webp">>, t.Record<{
        from_path: t.String;
    }>>;
}>;
export declare type FormatConfig = t.Static<typeof FormatConfig>;
export default FormatConfig;

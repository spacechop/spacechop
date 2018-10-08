import * as t from 'runtypes';
declare const ResizeConfig: t.Record<{
    width: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
        from_path: t.String;
    }>>;
    height: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
        from_path: t.String;
    }>>;
}>;
export declare type ResizeConfig = t.Static<typeof ResizeConfig>;
export default ResizeConfig;

import * as t from 'runtypes';
declare const FitConfig: t.Constraint<t.Part<{
    width: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
        from_path: t.String;
    }>>;
    height: t.Union2<t.Constraint<t.Number, {}>, t.Record<{
        from_path: t.String;
    }>>;
}>, {}>;
export declare type FitConfig = t.Static<typeof FitConfig>;
export default FitConfig;

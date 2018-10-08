import * as t from 'runtypes';
declare const HttpSourceConfig: t.Record<{
    root: t.Constraint<t.String, {}>;
}>;
export declare type HttpSourceConfig = t.Static<typeof HttpSourceConfig>;
export default HttpSourceConfig;

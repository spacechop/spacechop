import * as t from 'runtypes';
declare const CompressConfig: t.Part<{
    quality: t.Constraint<t.Number, {}>;
    lossy: t.Boolean;
}>;
export declare type CompressConfig = t.Static<typeof CompressConfig>;
export default CompressConfig;

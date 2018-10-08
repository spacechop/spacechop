import * as t from 'runtypes';
declare const VolumeSourceConfig: t.Record<{
    root: t.Constraint<t.String, {}>;
}>;
export declare type VolumeSourceConfig = t.Static<typeof VolumeSourceConfig>;
export default VolumeSourceConfig;

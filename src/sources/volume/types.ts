import * as t from 'runtypes';

const pattern = /^\/.*/i;

const VolumeSourceConfig = t.Record({
  pattern: t.String.withConstraint(
    (n) => (n && n.length > 0 && pattern.test(n)) || 'Requires valid root',
  ),
});

export type VolumeSourceConfig = t.Static<typeof VolumeSourceConfig>;
export default VolumeSourceConfig;

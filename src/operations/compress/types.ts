import * as t from 'runtypes';

const CompressConfig = t.Partial({
  quality: t.Number.withConstraint(
    (n) => (n >= 0 && n <= 100) || 'quality must be between 0 and 100',
  ),
  lossy: t.Boolean,
});

export type CompressConfig = t.Static<typeof CompressConfig>;
export default CompressConfig;

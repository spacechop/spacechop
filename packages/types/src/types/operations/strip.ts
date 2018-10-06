import * as t from 'runtypes';

const StripConfig = t.Partial({
  icc_profile: t.Boolean,
});

export type StripConfig = t.Static<typeof StripConfig>;
export default StripConfig;

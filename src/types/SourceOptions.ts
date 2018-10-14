import * as t from 'runtypes';

const SourceOptions = t.Record({
  original: t.Boolean,
});

export type SourceOptions = t.Static<typeof SourceOptions>;
export default SourceOptions;

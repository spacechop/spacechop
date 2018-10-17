import * as t from 'runtypes';
import PreprocessSource from './PreprocessSource';

const PreprocessRequirements = t.Partial({
  sources: t.Array(PreprocessSource),
});

export type PreprocessRequirements = t.Static<typeof PreprocessRequirements>;

export default PreprocessRequirements;

import * as t from 'runtypes';
import ExtraSource from './ExtraSource';

const ExtraRequirement = t.Partial({
  sources: t.Array(ExtraSource),
});

export type ExtraRequirement = t.Static<typeof ExtraRequirement>;

export default ExtraRequirement;

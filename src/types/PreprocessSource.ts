import * as t from 'runtypes';
import ImageDefinition from './ImageDefinition';

const PreprocessSource = t.Record({
  source: t.String,
  handle: t.String,
  state: ImageDefinition,
}).And(t.Partial({
  params: t.Dictionary(t.String, 'string'),
  preset: t.String,
}));

export type PreprocessSource = t.Static<typeof PreprocessSource>;

export default PreprocessSource;

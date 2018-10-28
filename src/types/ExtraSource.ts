import * as t from 'runtypes';
import ImageDefinition from './ImageDefinition';

const ExtraSource = t.Record({
  source: t.String,
  handle: t.String,
  state: ImageDefinition,
}).And(t.Partial({
  params: t.Dictionary(t.String, 'string'),
  preset: t.String,
}));

export type ExtraSource = t.Static<typeof ExtraSource>;

export default ExtraSource;

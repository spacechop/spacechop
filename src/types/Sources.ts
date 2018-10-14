import * as t from 'runtypes';
import Source from './Source';

const Sources = t.Dictionary(Source, 'string');

export type Sources = t.Static<typeof Sources>;
export default Sources;

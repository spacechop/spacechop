import * as t from 'runtypes';
import Source from './Source';

const Sources = t.Array(Source);

export type Sources = t.Static<typeof Sources>;
export default Sources;

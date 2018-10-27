import * as t from 'runtypes';
import Arrangement from '../../types/Arrangement';
import Blending from '../../types/Blending';
import Composition from '../../types/Composition';
import Gravity from '../../types/Gravity';
import Offset from '../../types/Offset';

const ComposeConfig = t.Record({
  source: t.String,
}).And(t.Partial({
  params: t.Dictionary(t.String, 'string'),
  preset: t.String,
  compose: Composition,
  arrange: Arrangement,
  gravity: Gravity,
  offset: Offset,
  blend: Blending,
}));

export type ComposeConfig = t.Static<typeof ComposeConfig>;
export default ComposeConfig;

import * as t from 'runtypes';
import Arrangement from '../../types/Arrangement';
import Blending from '../../types/Blending';
import Composition from '../../types/Composition';
import Gravity from '../../types/Gravity';
import Offset from '../../types/Offset';
import Param from '../../types/Param';

const ComposeConfig = t.Record({
  source: t.String,
}).And(t.Partial({
  params: t.Dictionary(t.String, 'string'),
  preset: t.Union(t.String, Param),
  compose: t.Union(Composition, Param),
  arrange: t.Union(Arrangement, Param),
  gravity: t.Union(Gravity, Param),
  offset: Offset,
  blend: t.Union(Blending, Param),
}));

export type ComposeConfig = t.Static<typeof ComposeConfig>;
export default ComposeConfig;

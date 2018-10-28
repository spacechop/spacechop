import * as t from 'runtypes';
import Opacity from '../../types/Opacity';
import Param from '../../types/Param';

const AlphaConfig = t.Record({
  opacity: Opacity.Or(Param),
});

export type AlphaConfig = t.Static<typeof AlphaConfig>;
export default AlphaConfig;

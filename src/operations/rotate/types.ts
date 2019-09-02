import * as t from 'runtypes';
import Param from '../../types/Param';
import AngleNumber from '../../types/AngleNumber';

const RotateConfig = t.Record({
  angle: t.Union(AngleNumber, t.Literal('auto'), Param),
});

export type RotateConfig = t.Static<typeof RotateConfig>;
export default RotateConfig;

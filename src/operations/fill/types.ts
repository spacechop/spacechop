import * as t from 'runtypes';
import Gravity from '../../types/Gravity';
import Param from '../../types/Param';
import PostiveNumber from '../../types/PositiveNumber';

const FillConfig = t.Record({
  width: t.Union(PostiveNumber, Param),
  height: t.Union(PostiveNumber, Param),
}).And(t.Partial({
  gravity: t.Union(Gravity, Param),
}));

export type FillConfig = t.Static<typeof FillConfig>;
export default FillConfig;

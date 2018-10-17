import * as t from 'runtypes';
import Gravity from '../../types/Gravity';
import Param from '../../types/Param';
import Percentage from '../../types/Percentage';
import PostiveNumber from '../../types/PositiveNumber';

const FillConfig = t.Record({
  width: t.Union(PostiveNumber, Param, Percentage),
  height: t.Union (PostiveNumber, Param, Percentage),
}).And(t.Partial({
  gravity: t.Union(Gravity, Param),
}));

export type FillConfig = t.Static<typeof FillConfig>;
export default FillConfig;

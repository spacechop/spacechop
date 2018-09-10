import * as t from 'runtypes';
import Param from '../../types/Param';
import Gravity from '../Gravity';
import PostiveNumber from '../PositiveNumber';

const FillConfig = t.Record({
  width: t.Union(PostiveNumber, Param),
  height: t.Union(PostiveNumber, Param),
}).And(t.Partial({
  gravity: t.Union(Gravity, Param),
}));

export type FillConfig = t.Static<typeof FillConfig>;
export default FillConfig;

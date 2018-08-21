import * as t from 'runtypes';
import Gravity from './../Gravity';
import PostiveNumber from './../PositiveNumber';

const FillConfig = t.Record({
  width: PostiveNumber,
  height: PostiveNumber,
}).And(t.Partial({
  gravity: Gravity,
}));

export type FillConfig = t.Static<typeof FillConfig>;
export default FillConfig;

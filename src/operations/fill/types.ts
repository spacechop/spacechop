import * as t from 'runtypes';
import Gravity from './../Gravity';

const FillConfig = t.Record({
  width: t.Number,
  height: t.Number,
}).And(t.Partial({
  gravity: Gravity,
}));

export type FillConfig = t.Static<typeof FillConfig>;
export default FillConfig;



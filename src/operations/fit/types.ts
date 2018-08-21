import * as t from 'runtypes';
import Gravity from './../Gravity';

const FitConfig = t.Partial({
  width: t.Number,
  height: t.Number,
  gravity: Gravity,
});


export type FitConfig = t.Static<typeof FitConfig>;
export default FitConfig;

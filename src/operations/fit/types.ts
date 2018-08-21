import * as t from 'runtypes';
import Gravity from './../Gravity';
import PostiveNumber from './../PositiveNumber';

const FitConfig = t.Partial({
  width: PostiveNumber,
  height: PostiveNumber,
  gravity: Gravity,
}).withConstraint((n) => {
  if (!(n.width || n.height)) {
    return 'missing width or height';
  }
  return true;
});


export type FitConfig = t.Static<typeof FitConfig>;
export default FitConfig;

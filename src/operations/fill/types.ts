import * as t from 'runtypes';
import Gravity from './../Gravity';
import PostiveNumber from './../PositiveNumber';

const FillConfig = t.Record({
  width: PostiveNumber,
  height: PostiveNumber,
}).And(t.Partial({
  gravity: Gravity,
})).withConstraint((n) => {
  if (!(n.width || n.height)) {
    return 'missing width or height';
  }
  return true;
});

export type FillConfig = t.Static<typeof FillConfig>;
export default FillConfig;

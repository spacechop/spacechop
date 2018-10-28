import * as t from 'runtypes';
import Param from '../../types/Param';
import Percentage from '../../types/Percentage';
import PostiveNumber from '../../types/PositiveNumber';

const FitConfig = t.Partial({
  width: t.Union(PostiveNumber, Param, Percentage),
  height: t.Union(PostiveNumber, Param, Percentage),
}).withConstraint((n) => {
  if (!(n.width || n.height)) {
    return 'missing width or height';
  }
  return true;
});

export type FitConfig = t.Static<typeof FitConfig>;
export default FitConfig;

import * as t from 'runtypes';
import Param from '../../types/Param';
import PostiveNumber from '../../types/PositiveNumber';

const FitConfig = t.Partial({
  width: t.Union(PostiveNumber, Param),
  height: t.Union(PostiveNumber, Param),
}).withConstraint((n) => {
  if (!(n.width || n.height)) {
    return 'missing width or height';
  }
  return true;
});

export type FitConfig = t.Static<typeof FitConfig>;
export default FitConfig;

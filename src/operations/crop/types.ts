import * as t from 'runtypes';
import Gravity from '../../types/Gravity';
import Offset from '../../types/Offset';
import Param from '../../types/Param';
import Percentage from '../../types/Percentage';
import PostiveNumber from '../../types/PositiveNumber';

const CropConfig = t.Partial({
  width: t.Union(PostiveNumber, Param, Percentage),
  height: t.Union(PostiveNumber, Param, Percentage),
  gravity: t.Union(Gravity, Param),
  offset: Offset,
}).withConstraint((n) => {
  if (!(n.width || n.height)) {
    return 'missing width or height';
  }
  return true;
});

export type CropConfig = t.Static<typeof CropConfig>;
export default CropConfig;

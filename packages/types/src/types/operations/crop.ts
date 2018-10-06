import * as t from 'runtypes';
import Param from '../../types/Param';
import Gravity from '../Gravity';
import PostiveNumber from '../PositiveNumber';

const CropConfig = t.Partial({
  width: t.Union(PostiveNumber, Param),
  height: t.Union(PostiveNumber, Param),
  gravity: t.Union(Gravity, Param),
}).withConstraint((n) => {
  if (!(n.width || n.height)) {
    return 'missing width or height';
  }
  return true;
});

export type CropConfig = t.Static<typeof CropConfig>;
export default CropConfig;

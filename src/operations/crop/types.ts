import * as t from 'runtypes';
import Gravity from './../Gravity';

const CropConfig = t.Partial({
  width: t.Number,
  height: t.Number,
  gravity: Gravity,
}).withConstraint((n) => n && !!(n.width || n.height));

export type CropConfig = t.Static<typeof CropConfig>;
export default CropConfig;

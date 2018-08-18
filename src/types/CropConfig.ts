import * as t from 'runtypes';
import Gravity from './Gravity';

export default t.Partial({
  width: t.Number,
  height: t.Number,
  gravity: Gravity,
}).withConstraint((n) => n && !!(n.width || n.height));

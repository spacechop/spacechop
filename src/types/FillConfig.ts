import * as t from 'runtypes';
import Gravity from './Gravity';

export default t.Record({
  width: t.Number,
  height: t.Number,
  gravity: t.Union(t.Undefined, Gravity),
});

import * as t from 'runtypes';
import Param from './Param';
import Percentage from './Percentage';

const Offset = t.Record({
  x: t.Union(t.Number, Param, Percentage),
  y: t.Union(t.Number, Param, Percentage),
});

export type Offset = t.Static<typeof Offset>;
export default Offset;

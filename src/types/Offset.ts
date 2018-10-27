import * as t from 'runtypes';

const Offset = t.Record({
  x: t.Number,
  y: t.Number,
});

export type Offset = t.Static<typeof Offset>;
export default Offset;

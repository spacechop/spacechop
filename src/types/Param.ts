import * as t from 'runtypes';

const Param = t.Record({
  from_path: t.String,
});

export type Param = t.Static<typeof Param>;
export default Param;

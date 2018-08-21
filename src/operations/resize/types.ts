import * as t from 'runtypes';

const ResizeConfig = t.Record({
  width: t.Number,
  height: t.Number,
});

export type ResizeConfig = t.Static<typeof ResizeConfig>;
export default ResizeConfig;

import * as t from 'runtypes';
import PositiveNumber from '../PositiveNumber';

const ResizeConfig = t.Record({
  width: PositiveNumber,
  height: PositiveNumber,
});

export type ResizeConfig = t.Static<typeof ResizeConfig>;
export default ResizeConfig;

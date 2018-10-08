import * as t from 'runtypes';
import Param from '../../types/Param';
import PositiveNumber from '../../types/PositiveNumber';

const ResizeConfig = t.Record({
  width: t.Union(PositiveNumber, Param),
  height: t.Union(PositiveNumber, Param),
});

export type ResizeConfig = t.Static<typeof ResizeConfig>;
export default ResizeConfig;

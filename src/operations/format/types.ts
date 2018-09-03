import * as t from 'runtypes';
import Format from '../../types/Format';
import Param from '../../types/Param';

const FormatConfig = t.Record({
  type: t.Union(Format, Param),
});

export type FormatConfig = t.Static<typeof FormatConfig>;
export default FormatConfig;

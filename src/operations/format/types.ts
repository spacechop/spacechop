import * as t from 'runtypes';
import Format from './../../types/Format';

const FormatConfig = t.Partial({
  type: Format,
});

export type FormatConfig = t.Static<typeof FormatConfig>;
export default FormatConfig;

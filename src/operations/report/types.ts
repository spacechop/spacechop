import * as t from 'runtypes';
import ReportFormat from './../../types/ReportFormat';

const ReportConfig = t.Partial({
  format: ReportFormat,
  compact: t.Boolean,
});

export type ReportConfig = t.Static<typeof ReportConfig>;
export default ReportConfig;

import * as t from 'runtypes';

const ReportFormat = t.Union(
  t.Literal('json'),
);

export const allFormats = ReportFormat.alternatives.map((f) => f.value);
export type ReportFormat = t.Static<typeof ReportFormat>;
export default ReportFormat;

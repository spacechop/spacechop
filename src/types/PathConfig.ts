import * as t from 'runtypes';
import PathPattern from './PathPattern';

const PathConfig = t.Record({
  pattern: PathPattern,
}).And(t.Partial({
  query: t.Dictionary(t.String, 'string'),
})).withConstraint(
  (n) => n && Object.keys(n).length > 0 || 'Requires at least one path',
);

export type PathConfig = t.Static<typeof PathConfig>;
export default PathConfig;

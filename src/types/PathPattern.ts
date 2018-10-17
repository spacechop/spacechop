import * as t from 'runtypes';

const PathPattern = t.String
  .withConstraint((n) => !!n || 'Cannot be empty')
  .withConstraint((n) => /^\//.test(n) || 'Must start with /');

export type PathPattern = t.Static<typeof PathPattern>;
export default PathPattern;

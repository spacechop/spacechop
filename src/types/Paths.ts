import * as t from 'runtypes';

// Test to make sure :preset exists in path.
const pattern = /^\/.*:preset(\([^)]+\))?([^\w)]*?$|\/.*)/i;

const Paths = t.Array(t.String
  .withConstraint((n) => !!n || 'Cannot be empty')
  .withConstraint((n) => /^\//.test(n) || 'Must start with /')
  .withConstraint((n) => pattern.test(n) || 'Requires :preset in path'),
).withConstraint((n) => n && n.length > 0 || 'Requires at least one path');

export type Paths = t.Static<typeof Paths>;
export default Paths;

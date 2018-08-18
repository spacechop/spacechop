import * as t from 'runtypes';
import Source from './Source';
import PresetConfig from './PresetConfig';

// Test to make sure :preset exists in path.
const pattern = /^\/.*:preset(\([^)]+\))?([^\w)]*?$|\/.*)/i;

export default t.Record({
  paths: t.Array(
    t.String
      .withConstraint(n => !!n || 'Cannot be empty')
      .withConstraint(n => /^\//.test(n) || 'Must start with /')
      .withConstraint(n => pattern.test(n) || 'Requires :preset in path'),
  ).withConstraint(n => n && n.length > 0 || 'Requires at least one path'),
  sources: t.Array(Source),
  presets: t.Dictionary(PresetConfig, 'string'),
});

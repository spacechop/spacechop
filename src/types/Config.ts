import * as t from 'runtypes';
import PresetConfig from './PresetConfig';
import Source from './Source';
import Storage from './Storage';

// Test to make sure :preset exists in path.
const pattern = /^\/.*:preset(\([^)]+\))?([^\w)]*?$|\/.*)/i;

const Config = t.Record({
  paths: t.Array(
    t.String
      .withConstraint((n) => !!n || 'Cannot be empty')
      .withConstraint((n) => /^\//.test(n) || 'Must start with /')
      .withConstraint((n) => pattern.test(n) || 'Requires :preset in path'),
  ).withConstraint((n) => n && n.length > 0 || 'Requires at least one path'),
  sources: t.Array(Source),
  presets: t.Dictionary(PresetConfig, 'string'),
}).And(t.Partial({
  storage: Storage
}))

export type Config = t.Static<typeof Config>;
export default Config;

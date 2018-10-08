import * as t from 'runtypes';
import validateParams from '../lib/validateParams';
import Paths from './Paths';
import Presets from './Presets';
import Sources from './Sources';
import Storage from './Storage';

const Config = t.Record({
  paths: Paths,
  sources: Sources,
  presets: Presets,
}).And(t.Partial({
  storage: Storage,
  disableChunkedEncoding: t.Boolean,
})).withConstraint(validateParams);

export type Config = t.Static<typeof Config>;
export default Config;

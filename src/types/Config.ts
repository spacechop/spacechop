import * as t from 'runtypes';
import validateParams from '../lib/validateParams';
import ParamSchema from './ParamSchema';
import Presets from './Presets';
import Services from './Services';
import Sources from './Sources';
import Storage from './Storage';

const Config = t.Record({
  services: Services,
  sources: Sources,
  presets: Presets,
}).And(t.Partial({
  storage: Storage,
  params: ParamSchema,
  disableChunkedEncoding: t.Boolean,
})).withConstraint(validateParams);

export type Config = t.Static<typeof Config>;
export default Config;

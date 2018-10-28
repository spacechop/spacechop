import * as t from 'runtypes';
import ParamSchema from './ParamSchema';
import PathConfig from './PathConfig';

const ServiceConfig = t.Record({
  path: PathConfig,
}).And(t.Partial({
  params: ParamSchema,
}));

export type ServiceConfig = t.Static<typeof ServiceConfig>;
export default ServiceConfig;

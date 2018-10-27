import * as t from 'runtypes';
import ServiceConfig from './ServiceConfig';

const Services = t.Dictionary(ServiceConfig, 'string')
.withConstraint(
  (n) => n && Object.keys(n).length > 0 || 'Requires at least one service',
);

export type Services = t.Static<typeof Services>;
export default Services;

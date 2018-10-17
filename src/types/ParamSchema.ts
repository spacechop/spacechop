import * as t from 'runtypes';
import ParamTypes from './ParamTypes';

const ParamSchema = t.Dictionary(ParamTypes, 'string');

export type ParamSchema = t.Static<typeof ParamSchema>;
export default ParamSchema;

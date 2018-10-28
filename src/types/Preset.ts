import * as t from 'runtypes';
import LookupParamsConfig from './LookupParamsConfig';
import Step from './Step';

const Preset = t.Record({
  steps: t.Array(Step),
}).And(t.Partial({
  lookup_params: LookupParamsConfig,
}));

export type Preset = t.Static<typeof Preset>;
export default Preset;

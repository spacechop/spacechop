import * as t from 'runtypes';
import Step from './Step';

const options = Object.keys(Step.underlying.fields).map(
  (key) => Step.underlying.fields[key],
);
const StepConfig = t.Union.apply(this, options);

export type StepConfig = t.Static<typeof StepConfig>;
export default StepConfig;

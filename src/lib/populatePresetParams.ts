import { Params } from '../config/params';
import { Step } from '../types/Step';
import { StepConfig } from '../types/StepConfig';

// Populate steps with params from request.
export default (
  steps: Step[],
  params: Params,
): Step[] => {
  return steps.map((step: Step) => {
    const name = Object.keys(step)[0];
    const config: StepConfig = Object.keys(step[name]).reduce((acc, key) => ({
      ...acc,
      [key]: params[key] || step[name][key],
    }), {});
    return { [name]: config };
  });
};

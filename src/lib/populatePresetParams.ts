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
    const config: StepConfig = Object.keys(step[name]).reduce((acc, key) => {
      const value = step[name][key];
      const param = value.from_path;
      return ({
        ...acc,
        [key]: params[param] || value,
      });
    }, {});
    return { [name]: config };
  });
};

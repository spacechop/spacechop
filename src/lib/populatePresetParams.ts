import { Params } from '../config/params';
import StepType from '../types/Step';
import { Step } from '../types/Step';
import { StepConfig } from '../types/StepConfig';


// Casts passed value
// Ex:
// 'true' -> true
// 'false' -> false
// '100' -> 100
// 'value' -> 'value'
export const castValue = (value: string): boolean | number | string => {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  const maybeNumber = parseFloat(value);
  if (!isNaN(maybeNumber)) {
    return maybeNumber;
  }
  return value;
};

// Populate steps with params from request.
export default (
  steps: Step[],
  params: Params,
): Step[] => {
  const populatedSteps = steps.map((step: Step) => {
    const name = Object.keys(step)[0];
    const config: StepConfig = Object.keys(step[name]).reduce((acc, key) => {
      let value = step[name][key];
      if (typeof value === 'object' && 'from_path' in value) {
        const paramKey = step[name][key].from_path;
        value = castValue(params[paramKey]);
      }
      return {
        ...acc,
        [key]: value,
      };
    }, {});
    return { [name]: config };
  });

  // The check method will cast the step and throw an error if
  // value is not of expected type
  return populatedSteps.map(StepType.check);
};

import { Params } from '../config/params';
import { Format, parseFormat } from '../types/Format';
import { ImageDefinition } from '../types/ImageDefinition';
import StepType from '../types/Step';
import { Step } from '../types/Step';

// Casts passed value
// Ex:
// 'true' -> true
// 'false' -> false
// '100' -> 100
// 'value' -> 'value'
export const castValue = (value: string): boolean | number | string | Format => {
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
  const maybeFormat = parseFormat(value);
  if (maybeFormat) {
    return maybeFormat;
  }
  return value;
};

// Populate steps with params from request.
export default (
  steps: Step[],
  params: Params,
  state?: ImageDefinition,
): Step[] => {
  const populatedSteps = steps.map((step: Step) => {
    const name = Object.keys(step)[0];
    const config: Step = Object.keys(step[name]).reduce((acc, key) => {
      let value = step[name][key];
      if (/^[$]/.test(value)) {
        const paramKey = step[name][key].replace(/^[$]/, '');
        value = castValue(params[paramKey]);
      }
      if (key === 'width' && /^\d+%$/.test(value)) {
        value = state.width * parseFloat(value.replace(/%/, '')) / 100;
      }
      if (key === 'height' && /^\d+%$/.test(value)) {
        value = state.height * parseFloat(value.replace(/%/, '')) / 100;
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

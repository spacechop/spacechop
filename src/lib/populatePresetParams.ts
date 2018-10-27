import { Params } from '../config/params';
import { Format, parseFormat } from '../types/Format';
import { ImageDefinition } from '../types/ImageDefinition';
import StepType from '../types/Step';
import { Step } from '../types/Step';

const populateConfig = (config: any, params: any, state: ImageDefinition): any => {
  return Object.keys(config).reduce((acc, key) => {
    let value = config[key];
    // Populate params.
    if (/^[$]/.test(value)) {
      const paramKey = config[key].replace(/^[$]/, '');
      value = castValue(params[paramKey]);
    }
    // Populate relative width.
    if (key === 'width' && /^\d+%$/.test(value)) {
      value = state.width * parseFloat(value.replace(/%/, '')) / 100;
    }
    // Populate relative height.
    if (key === 'height' && /^\d+%$/.test(value)) {
      value = state.height * parseFloat(value.replace(/%/, '')) / 100;
    }
    // Recursing through nested configuration.
    if (typeof value === 'object') {
      value = populateConfig(value, params, state);
    }
    return {
      ...acc,
      [key]: value,
    };
  }, {});
};

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
    const config = populateConfig(step[name], params, state);
    return { [name]: config };
  });

  // The check method will cast the step and throw an error if
  // value is not of expected type
  return populatedSteps.map(StepType.check);
};

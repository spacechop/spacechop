import { Params } from '../config/params';
import { Format, parseFormat } from '../types/Format';
import { ImageDefinition } from '../types/ImageDefinition';
import StepType from '../types/Step';
import { Step } from '../types/Step';

const populateConfig = (config: any, params: any): any => {
  return Object.keys(config).reduce((acc, key) => {
    let value = config[key];
    // Populate params.
    if (/^[$]/.test(value)) {
      value = castValue(config[key].replace(/[$](\w+)/ig,
        (_, paramKey) => params[paramKey],
      ));
    }
    // Recursing through nested configuration.
    if (typeof value === 'object') {
      value = populateConfig(value, params);
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
  if (!isNaN(maybeNumber) && value === `${maybeNumber}`) {
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
): Step[] => {
  const populatedSteps = steps.map((step: Step) => {
    const name = Object.keys(step)[0];
    const config = populateConfig(step[name], params);
    return { [name]: config };
  });

  // The check method will cast the step and throw an error if
  // value is not of expected type
  return populatedSteps.map(StepType.check);
};

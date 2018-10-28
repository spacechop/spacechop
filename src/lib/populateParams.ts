import { Params } from '../config/params';
import { castValue } from './populatePresetParams';

// Populate steps with params from request.
export default (
  input: any,
  params: Params,
): Params => {
  return Object.keys(input || {}).reduce((acc: Params, param: string) => {
    let value = params[param];
    // Populate params.
    if (/^[$]/.test(value)) {
      const paramKey = value.replace(/^[$]/, '');
      value = castValue(params[paramKey]);
    }
    return {
      ...acc,
      [param]: value,
    };
  }, params);
};

import { Params } from '../config/params';

// Extract named parameters from request.
export default (
  params: [{ name: string }],
  values: [any],
): Params => {
  return params.reduce((acc, param, i) => Object.assign(acc, {
    [param.name]: values[i],
  }), { preset: null });
};

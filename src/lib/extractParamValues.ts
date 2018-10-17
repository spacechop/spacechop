import { Request } from 'express';
import URL from 'url';
import { Params } from '../config/params';
import { ParamSchema } from '../types/ParamSchema';
import { format } from '../types/ParamTypes';
import { PathConfig } from '../types/PathConfig';

const extractQueryParams = (
  path: PathConfig,
  url: string,
  types: ParamSchema,
): any => {
  const parts = URL.parse(url, true);
  const params = Object.keys(path.query || {});
  return params.reduce((acc, param) => {
    const type = types[param];
    const value = parts.query[path.query[param]];
    return {
      ...acc,
      [param]: format(type, value),
    };
  }, {});
};

const extractPathParams = (
  params: [{ name: string }],
  values: any,
  types: ParamSchema,
): any => {
  return params.reduce((acc, param, i) => {
    const type = types[param.name];
    const value = values[i];
    return {
      ...acc,
      [param.name]: format(type, value),
    };
  }, { preset: null });
};

// Extract named parameters from request.
export default (
  params: [{ name: string }],
  path: PathConfig,
  request: Request,
  types: ParamSchema,
): Params => {
  const queryParams = extractQueryParams(path, request.url, types);
  const pathParams = extractPathParams(params, request.params, types);
  // Combine path params and query params.
  return {
    preset: null,
    ...pathParams,
    ...queryParams,
  };
};

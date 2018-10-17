import { Sources as SourcesType } from '../../types/Sources';
import Source from '../sources';
import instantiateSource from './instantiate-source';

export default (sources: SourcesType): Source => {
  return Object.keys(sources).reduce((acc, key) => {
    return {
      ...acc,
      [key]: Object.keys(sources[key]).reduce((instances, type) => ({
        ...instances,
        [type]: instantiateSource(type, sources[key]),
      }), {}),
    };
  }, {});
};

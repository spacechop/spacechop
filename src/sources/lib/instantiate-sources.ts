import { SourceOptions } from '../../types/SourceOptions';
import { Sources as SourcesType } from '../../types/Sources';
import Source from '../sources';
import instantiateSource from './instantiate-source';

const defaultSourceOptions: SourceOptions = {
  original: true,
};

export default (sources: SourcesType): Source => {
  return Object.keys(sources).reduce((acc, key) => {
    return {
      ...acc,
      [key]: {
        ...defaultSourceOptions,
        ...sources[key],
        instance: instantiateSource(sources[key]),
      },
    };
  }, {});
};

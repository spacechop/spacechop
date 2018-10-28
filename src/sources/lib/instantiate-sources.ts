import { Sources as SourcesType } from '../../types/Sources';
import Source from '../sources';
import instantiateSource from './instantiate-source';

export default (sources: SourcesType): Source => {
  return Object.keys(sources).reduce((members, member) => ({
    ...members,
    [member]: instantiateSource(sources[member]),
  }), {});
};

import { Source as SourceInput } from './../../types/Source';
import Sources from './../index';
import Source from './../source';

export default (type: string, source: SourceInput): Source => {
  const props = source[type];
  return new Sources[type](props);
};

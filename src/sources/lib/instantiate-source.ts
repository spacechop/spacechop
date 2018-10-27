import { Source as SourceInput } from './../../types/Source';
import Sources from './../index';
import Source from './../source';

export default (source: SourceInput): Source => {
  const type = Object.keys(source)[0];
  const props = source[type];
  return new Sources[type](props);
};

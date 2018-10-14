import { Source as SourceInput } from './../../types/Source';
import Sources from './../index';
import Source from './../source';

const types: string[] = Object.keys(Sources);

export default (source: SourceInput): Source => {
  // determine type.
  const type = Object.keys(source).filter((k) => types.find((a) => a === k))[0];
  const props = source[type];
  return new Sources[type](props);
};

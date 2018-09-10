import { Source } from './../../types/Source';
import Sources from './../index';
import ISource from './../source';

export default (source: Source): ISource => {
  const name = Object.keys(source)[0];
  const props = source[name];
  const instance: ISource = new Sources[name](props);
  return instance;
};

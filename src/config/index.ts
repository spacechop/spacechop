import * as t from 'runtypes';
import Config from '../types/Config';
import load from './load';
import validate from './validate';

export default (): t.Static<typeof Config> => {
  const config = load('/config.yml');
  if (config && validate(config)) {
    return config;
  }
  return null;
};

import * as t from 'runtypes';
import Config from '../types/Config';
import load from './load';
import validate from './validate';
import console from '../lib/console';

export default (): t.Static<typeof Config> => {
  const config = load('/config.yml');
  try {
    if (config && validate(config)) {
      return config;
    }
  } catch (err) {
    console.info(err);
  }
  return null;
};

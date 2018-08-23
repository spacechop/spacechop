import console from '../lib/console';
import { Config } from '../types/Config';
import load from './load';
import validate from './validate';

export default (filename = '/config.yml'): Config => {
  try {
    const config = load(filename);
    if (config && validate(config)) {
      return config;
    }
  } catch (err) {
    console.info(err);
  }
  return null;
};

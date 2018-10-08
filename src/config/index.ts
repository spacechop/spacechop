import console from '../lib/console';
import { Config } from '../types/Config';
import load from './load';
import validate from './validate';

export { validate, Config };

const {
  CONFIG_PATH = '/config.yml',
} = process.env;

export default (filename = CONFIG_PATH): Config => {
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

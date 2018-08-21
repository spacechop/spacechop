import Config from '../types/Config';
import console from './console';

export const validate = (config) => {
  try {
    Config.check(config);
  } catch (err) {
    throw new Error(`${err.key}: ${err.message}`);
  }
};

let valid = true;

export default (config, throwError = false) => {
  try {
    validate(config);
    if (!valid) {
      valid = true;
      console.info('Config is valid again');
    }
    return true;
  } catch (err) {
    valid = false;
    console.error('\nThere is an error in /config.yml:');
    console.error('--------------------------------');
    console.error(err.message);
    console.error('--------------------------------');
    if (throwError) {
      throw new Error(err);
    }
  }
  return false;
};

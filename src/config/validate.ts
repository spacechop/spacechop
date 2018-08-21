import Config from '../types/Config';

export const validate = (config) => {
  try {
    Config.check(config);
  } catch (err) {
    throw new Error(`${err.key}: ${err.message}`);
  }
};

let valid = true;

export default (config, print = true) => {
  try {
    validate(config);
    if (!valid) {
      valid = true;
      if (print) {
        console.info('Config is valid again');
      }
    }
    return true;
  } catch (err) {
    valid = false;
    if (print) {
      console.error('\nThere is an error in /config.yml:');
      console.error('--------------------------------');
      console.error(err.message);
      console.error('--------------------------------');
    } else {
      throw new Error(err);
    }
  }
  return false;
};

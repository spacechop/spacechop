import { validate } from '@spacechop/types';

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

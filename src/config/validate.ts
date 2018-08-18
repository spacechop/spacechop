import Config from '../types/Config';

export const validate = (config) => {
  try {
    Config.check(config);
  } catch (err) {
    throw new Error(`${err.key}: ${err.message}`);
  }
};

let valid = true;

export default (config) => {
  try {
    validate(config);
    if (!valid) {
      valid = true;
      console.log('Config is valid again');
    }
    return true;
  } catch (err) {
    valid = false;
    console.log('\nThere is an error in /config.yml:');
    console.log('--------------------------------');
    console.log(err.message);
    console.log('--------------------------------');
  }
  return false;
};

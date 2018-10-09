import Config from './Config';

export default (config) => {
  try {
    Config.check(config);
  } catch (err) {
    throw new Error(`${err.key ? `${err.key}: ` : ''}${err.message}`);
  }
};

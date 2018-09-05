import fs from 'fs';
import yaml from 'js-yaml';
import console from '../lib/console';

export const loadConfig = (filepath) => yaml.safeLoad(fs.readFileSync(filepath));

export default (filepath) => {
  if (fs.existsSync(filepath)) {
    try {
      const config = loadConfig(filepath);
      if (config) {
        return config;
      } else {
        throw new Error(`Configuration is empty, ${filepath}`);
      }
    } catch (err) {
      throw new Error(`Could not load ${filepath}:\n\n${err}`);
    }
  } else {
    throw new Error(`Could not find ${filepath}`);
  }
};

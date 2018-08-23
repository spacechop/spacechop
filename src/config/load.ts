import fs from 'fs';
import yaml from 'js-yaml';
import console from '../lib/console';

export const loadConfig = (filepath) => yaml.safeLoad(fs.readFileSync(filepath));

export default (filepath) => {
  if (fs.existsSync(filepath)) {
    try {
      return loadConfig(filepath) || null;
    } catch (err) {
      console.error(`Could not load ${filepath}`);
      console.error(err);
    }
  } else {
    console.error(`Could not find ${filepath}`);
  }
  return null;
};

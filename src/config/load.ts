import fs from 'fs';
import yaml from 'js-yaml';

export const loadConfig = (filepath) => yaml.safeLoad(fs.readFileSync(filepath));

export default (filepath) => {
  if (fs.existsSync('/config.yml')) {
    try {
      return loadConfig(filepath);
    } catch (err) {
      console.log(`Could not load ${filepath}`);
      console.error(err);
    }
  } else {
    console.log(`Could not find ${filepath}`);
  }
  return null;
};

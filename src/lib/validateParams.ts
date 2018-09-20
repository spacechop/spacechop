import extract from './extractPathParams';

export default (config) => {
  const errors = [];
  const { paths, sources, presets, storage} = config;
  // Extract path params.
  const params = {};
  for (const path of paths) {
    for (const param of extract(path)) {
      // Skip numerically indexed params to allow non capturing groups.
      if (!/^[\d]+$/.test('' + param.name)) {
        params[param.name] = 0;
      }
    }
  }

  // Validate params in sources.
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    const name = Object.keys(source)[0];
    for (const key of Object.keys(source[name])) {
      if (source[name][key].length > 0) {
        const sourceParams = extract(source[name][key]);
        for (const param of sourceParams) {
          if (typeof params[param.name] !== 'number') {
            errors.push(`source[${i}].${name}.${key}: Missing param "${param.name}" in paths`);
          } else {
            params[param.name]++;
          }
        }
      }
    }
  }

  // Validate params in preset steps.
  for (const preset of Object.keys(presets)) {
    for (let i = 0; i < presets[preset].steps.length; i++) {
      const step = presets[preset].steps[i];
      const operation = Object.keys(step)[0];
      for (const key of Object.keys(step[operation])) {
        const value = step[operation][key];
        if (typeof value === 'object' && 'from_path' in value) {
          if (typeof params[value.from_path] !== 'number') {
            errors.push(`presets.${preset}.steps[${i}].${key}`
              + `: Missing param (${value.from_path}) in paths for preset (${preset})`);
          } else {
            params[value.from_path]++;
          }
        }
      }
    }
  }

  // If storage is defined it should make use of the `:hash` parameter
  // in the configuration. It could be in any of the keys, but it must
  // be in at least one.
  if (storage) {
    const name = Object.keys(storage)[0];
    const strg = storage[name];
    let seenHashUsage = false;
    for (const key of Object.keys(strg)) {
      if (strg[key].length > 0) {
        const storageParams = extract(strg[key]);
        for (const param of storageParams) {
          if (param.name === 'hash') {
            seenHashUsage = true;
          }
        }
      }
    }
    if (!seenHashUsage) {
      errors.push(`storage.${name}: Missing usage of parameter ":hash"`);
    }
  }

  // For all params defined check usage.
  for (const param of Object.keys(params)) {
    switch (param) {
      // ignore preset
      case 'preset':
        break;

      default:
        if (params[param] === 0) {
          errors.push(`params.${param}: Could not find any usage in sources or paths`);
        }
    }
  }
  if (errors.length > 0) {
    return errors.join('\n');
  }
  return true;
};

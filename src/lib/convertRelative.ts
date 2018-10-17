export function convertRelativeValue(value: any, relative: number): number {
  return /%$/.test(`${value}`) ? relative * parseFloat(`${value}`) / 100 : value;
}

export default function convertRelativeConfig<T>(
  config: T,
  state: { width: number, height: number },
): T {
  return Object.keys(config).reduce((acc, key) => {
    let value = config[key];
    if (['width', 'x'].indexOf(key) >= 0) {
      value = convertRelativeValue(config[key], state.width);
    }
    if (['height', 'y'].indexOf(key) >= 0) {
      value = convertRelativeValue(config[key], state.width);
    }
    if (typeof value === 'object') {
      value = convertRelativeConfig(value, state);
    }
    return {
      ...acc,
      [key]: value,
    };
  }, {}) as T;
}

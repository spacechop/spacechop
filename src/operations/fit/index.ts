import ImageDefinition, { DefinitionRequirement, ImageType } from '../../imagedef';
import { magickTypeMap } from '../magickTypeMap';
import Operation from './../operation';

export interface FitConfig {
  width?: number;
  height?: number;
}

export const magickOptions = (config: FitConfig, state: ImageDefinition): String[] => {
  const width = config.width === undefined ? '' : config.width;
  const height = config.height === undefined ? '' : config.height;
  return [
    '-',
    `-resize ${width}x${height}`,
    `${magickTypeMap[state.type]}:-`,
  ];
};

export const transformState = (config: FitConfig, state: ImageDefinition): ImageDefinition => {
  let { width, height } = config;
  if (width && !height) {
    // calculate height to keep aspect ratio.
    const scale = width / state.width;
    height = state.height * scale;
  } else if (!width && height) {
    // calculate width to keep aspect ratio.
    const scale = height / state.height;
    width = state.width * scale;
  }
  return {
    ...state,
    width,
    height,
  };
};

export const defaultConfig: FitConfig = {
};

export default class Crop extends Operation {
  public config: FitConfig;
  constructor(config: FitConfig) {
    super({ ...defaultConfig, ...config });
  }

  public requirements(): [DefinitionRequirement?] {
    return [];
  }

  public execute(state: ImageDefinition): { command: String, state: ImageDefinition } {
    const options = magickOptions(this.config, state);
    return {
      state: transformState(this.config, state),
      command: 'magick ' + options.join(' '),
    };
  }
}

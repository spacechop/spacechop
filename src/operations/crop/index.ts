import Operation from './../operation';
import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
import { Gravity } from '../Gravity';
import { magickGravityMap } from '../magickGravityMap';
import { magickTypeMap } from '../magickTypeMap';

export interface CropConfig {
  gravity?: Gravity;
  width?: number;
  height?: number;
}

export const magickOptions = (config: CropConfig, state: ImageDefinition): Array<String> => {
  const width = config.width === undefined ? state.width : config.width;
  const height = config.height === undefined ? state.height : config.height;
  return [
    '-',
    `-gravity ${magickGravityMap[config.gravity]}`,
    `-crop ${width}x${height}+0+0`,
    `${magickTypeMap[state.type]}:-`
  ];
};

export const transformState = (config: CropConfig, state: ImageDefinition) : ImageDefinition => {
  const width = config.width === undefined ? state.width : config.width;
  const height = config.height === undefined ? state.height : config.height;
  return {
    ...state,
    width,
    height,
  }
}

export const defaultConfig: CropConfig = {
  gravity: Gravity.center,
};

export default class Crop extends Operation {
  config: CropConfig;
  constructor(config: CropConfig) {
    super({ ...defaultConfig, ...config });
  }

  requirements(): [DefinitionRequirement?] {
    if (this.config.gravity === Gravity.face) {
      return [ DefinitionRequirement.FACES ]
    }
    return [];
  }

  execute(state: ImageDefinition): { command: String, state: ImageDefinition } {
    const options = magickOptions(this.config, state);
    return {
      state: transformState(this.config, state),
      command: 'magick ' + options.join(' '),
    };
  }
}

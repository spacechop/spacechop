import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
import { magickGravityMap } from '../magickGravityMap';
import Operation from './../operation';
import { CropConfig } from './types';

export const magickOptions = (config: CropConfig, state: ImageDefinition): string[] => {
  const width = config.width === undefined ? state.width : config.width;
  const height = config.height === undefined ? state.height : config.height;
  return [
    '-',
    `-gravity ${magickGravityMap[config.gravity]}`,
    `-crop ${width}x${height}+0+0`,
    `${state.type}:-`,
  ];
};

export const transformState = (config: CropConfig, state: ImageDefinition): ImageDefinition => {
  const width = config.width === undefined ? state.width : config.width;
  const height = config.height === undefined ? state.height : config.height;
  return {
    ...state,
    width,
    height,
  };
};

export const defaultConfig: CropConfig = {
  gravity: 'center',
};

export default class Crop implements Operation {
  public config: CropConfig;
  constructor(config: CropConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  public requirements(): DefinitionRequirement[] {
    if (this.config.gravity === 'face') {
      return [ DefinitionRequirement.FACES ];
    }
    return [];
  }

  public execute(state: ImageDefinition): { command: string, state: ImageDefinition } {
    const options = magickOptions(this.config, state);
    return {
      state: transformState(this.config, state),
      command: 'magick ' + options.join(' '),
    };
  }
}

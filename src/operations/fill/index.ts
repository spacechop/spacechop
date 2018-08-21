import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
import { magickGravityMap } from '../magickGravityMap';
import Operation from './../operation';
import { FillConfig } from './types';

export const magickOptions = (config: FillConfig, state: ImageDefinition): string[] => {
  return [
    '-',
    `-resize ${config.width}x${config.height}^`,
    `-gravity ${magickGravityMap[config.gravity]}`,
    `-extent ${config.width}x${config.height}`,
    `${state.type}:-`,
  ];
};

export const transformState = (config: FillConfig, state: ImageDefinition): ImageDefinition => {
  return {
    ...state,
    width: config.width,
    height: config.height,
  };
};

export const defaultConfig: FillConfig = {
  width: 99999,
  height: 99999,
  gravity: 'center',
};

export default class Fill implements Operation {
  public config: FillConfig;
  constructor(config: FillConfig) {
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

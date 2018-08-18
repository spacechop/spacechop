import ImageDefinition, { DefinitionRequirement, ImageType } from '../../imagedef';
import { Gravity } from '../Gravity';
import { magickGravityMap } from '../magickGravityMap';
import { magickTypeMap } from '../magickTypeMap';
import Operation from './../operation';

export interface FillConfig {
  width: number;
  height: number;
  gravity?: Gravity;
}

export const magickOptions = (config: FillConfig, state: ImageDefinition): String[] => {
  return [
    '-',
    `-resize ${config.width}x${config.height}^`,
    `-gravity ${magickGravityMap[config.gravity]}`,
    `-extent ${config.width}x${config.height}`,
    `${magickTypeMap[state.type]}:-`,
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
  gravity: Gravity.center,
};

export default class Fill extends Operation {
  public config: FillConfig;
  constructor(config: FillConfig) {
    super({ ...defaultConfig, ...config });
  }

  public requirements(): [DefinitionRequirement?] {
    if (this.config.gravity === Gravity.face) {
      return [ DefinitionRequirement.FACES ];
    }
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

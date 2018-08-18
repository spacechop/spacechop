import Operation from './../operation';
import ImageDefinition, { DefinitionRequirement, ImageType } from '../../imagedef';
import { magickTypeMap } from '../magickTypeMap';

export interface ResizeConfig {
  width: number,
  height: number,
};

export const magickOptions = (config: ResizeConfig, state: ImageDefinition): Array<String> => {
  return [
    '-',
    `-resize ${config.width || ''}x${config.height || ''}!`,
    `${magickTypeMap[state.type]}:-`
  ];
};

export const transformState = (config: ResizeConfig, state: ImageDefinition) : ImageDefinition => {
  return {
    ...state,
    width: config.width,
    height: config.height,
  };
}

export const defaultConfig: ResizeConfig = {
  width: null,
  height: null,
};

export default class Crop extends Operation {
  config: ResizeConfig;
  constructor(config: ResizeConfig) {
    super({ ...defaultConfig, ...config });
  }

  requirements(): [DefinitionRequirement?] {
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

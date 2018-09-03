import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
import parseNumber from '../../lib/parseNumber';
import Operation from './../operation';
import { ResizeConfig } from './types';

export const magickOptions = (config: ResizeConfig, state: ImageDefinition): string[] => {
  return [
    '-',
    `-resize ${config.width || ''}x${config.height || ''}!`,
    `${state.type}:-`,
  ];
};

export const transformState = (config: ResizeConfig, state: ImageDefinition): ImageDefinition => {
  return {
    ...state,
    width: parseNumber(config.width),
    height: parseNumber(config.height),
  };
};

export const defaultConfig: ResizeConfig = {
  width: null,
  height: null,
};

export default class Crop implements Operation {
  public config: ResizeConfig;
  constructor(config: ResizeConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  public requirements(): DefinitionRequirement[] {
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

import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
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
  const width = config.width as number;
  const height = config.height as number;
  return {
    ...state,
    width,
    height
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

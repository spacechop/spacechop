import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
import Operation from './../operation';
import { StripConfig } from './types';

export const magickOptions = (config: StripConfig, state: ImageDefinition): string[] => {
  return [
    'magick',
    '-',
    '-strip',
    ...!config.icc_profile ? [
      '-sampling-factor',
      '4:2:0',
      '-colorspace',
      'sRGB',
    ] : [],
    `${state.type}:-`,
  ];
};


export const transformState = (_, state: ImageDefinition): ImageDefinition => {
  return {
    ...state,
  };
};

export const defaultConfig: StripConfig = {
  icc_profile: true,
};

export default class Strip implements Operation {
  public config: StripConfig;
  constructor(config: StripConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  public requirements(): DefinitionRequirement[] {
    return [];
  }

  public execute(state: ImageDefinition): { command: string, state: ImageDefinition } {
    const options = magickOptions(this.config, state);
    return {
      state: transformState(this.config, state),
      command: options.join(' '),
    };
  }
}

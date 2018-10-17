import { DefinitionRequirement, ImageDefinition } from '../../types';
import Operation from './../operation';
import { StripConfig } from './types';

export const exiftoolOptions = (config: StripConfig): string[] => {
  return [
    'exiftool',
    '-all=',
    ...!config.icc_profile ? ['--icc_profile:all'] : [],
    '-',
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

  public requirements(_: ImageDefinition): DefinitionRequirement {
    return {};
  }

  public execute(state: ImageDefinition): { command: string, state: ImageDefinition } {
    const options = exiftoolOptions(this.config);
    return {
      state: transformState(this.config, state),
      command: options.join(' '),
    };
  }
}

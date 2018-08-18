import ImageDefinition, { DefinitionRequirement, ImageType } from '../../imagedef';
import Operation from './../operation';

export interface StripConfig {
  icu_profile?: boolean;
}

export const exiftoolOptions = (config: StripConfig, state: ImageDefinition): String[] => {
  return [
    'exiftool',
    '-all=',
    // ...config.icu_profile ? ['--icc_profile:all'] : [],
    '-',
  ];
};


export const transformState = (_, state: ImageDefinition): ImageDefinition => {
  return {
    ...state,
  };
};

export const defaultConfig: StripConfig = {
  icu_profile: false,
};

export default class Strip extends Operation {
  public config: StripConfig;
  constructor(config: StripConfig) {
    super({ ...defaultConfig, ...config });
  }

  public requirements(): [DefinitionRequirement?] {
    return [];
  }

  public execute(state: ImageDefinition): { command: String, state: ImageDefinition } {
    const options = exiftoolOptions(this.config, state);
    return {
      state: transformState(this.config, state),
      command: options.join(' '),
    };
  }
}

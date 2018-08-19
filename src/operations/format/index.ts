import ImageDefinition, { DefinitionRequirement, ImageType } from '../../imagedef';
import { magickTypeMap } from '../magickTypeMap';
import Operation from '../operation';

export interface FormatConfig {
  type: ImageType;
}



export const magickOptions = (config: FormatConfig, state: ImageDefinition): string[] => {
  return [
    'convert',
    '-',
    `${magickTypeMap[config.type]}:-`,
  ];
};
export const transformState = (config: FormatConfig, state: ImageDefinition): ImageDefinition => {
  return {
    ...state,
    type: config.type,
  };
};

export default class Format extends Operation {
  public config: FormatConfig;
  constructor(config: FormatConfig) {
    super(config);
  }

  public requirements(): [DefinitionRequirement?] {
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

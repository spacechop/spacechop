import Operation from '../operation';
import ImageDefinition, { DefinitionRequirement, ImageType } from '../../imagedef';
import { magickTypeMap } from '../magickTypeMap';

export interface FormatConfig {
  type: ImageType,
};



export const magickOptions = (config: FormatConfig, state: ImageDefinition): Array<String> => {
  return [
    'convert',
    '-',
    `${magickTypeMap[config.type]}:-`
  ];
};
export const transformState = (config: FormatConfig, state: ImageDefinition) : ImageDefinition => {
  return {
    ...state,
    type: config.type
  }
}

export default class Format extends Operation {
  config: FormatConfig;
  constructor(config: FormatConfig) {
    super(config);
  }

  requirements(): [DefinitionRequirement?] {
    return [];
  }

  execute(state: ImageDefinition): { command: String, state: ImageDefinition } {
    const options = magickOptions(this.config, state);
    return {
      state: transformState(this.config, state),
      command: options.join(' '),
    };
  }
}

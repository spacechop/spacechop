import { DefinitionRequirement, ImageDefinition } from '../../types';
import Operation from '../operation';
import { Format as IFormat } from './../../types/Format';
import { FormatConfig } from './types';

export const magickOptions = (config: FormatConfig, _: ImageDefinition): string[] => {
  return [
    'convert',
    '-',
    `${config.type}:-`,
  ];
};
export const transformState = (config: FormatConfig, state: ImageDefinition): ImageDefinition => {
  const type = config.type as IFormat;
  return {
    ...state,
    type,
  };
};

export default class Format implements Operation {
  public config: FormatConfig;
  constructor(config: FormatConfig) {
    this.config = config;
  }

  public requirements(): DefinitionRequirement {
    return {};
  }

  public execute(state: ImageDefinition): { command: string, state: ImageDefinition } {
    const options = magickOptions(this.config, state);
    return {
      state: transformState(this.config, state),
      command: options.join(' '),
    };
  }
}

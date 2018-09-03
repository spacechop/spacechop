import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
import parseFormat from '../../lib/parseFormat';
import Operation from '../operation';
import { FormatConfig } from './types';

export const magickOptions = (config: FormatConfig, _: ImageDefinition): string[] => {
  return [
    'convert',
    '-',
    `${parseFormat(config.type)}:-`,
  ];
};
export const transformState = (config: FormatConfig, state: ImageDefinition): ImageDefinition => {
  return {
    ...state,
    type: parseFormat(config.type),
  };
};

export default class Format implements Operation {
  public config: FormatConfig;
  constructor(config: FormatConfig) {
    this.config = config;
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

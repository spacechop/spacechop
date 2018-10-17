import { DefinitionRequirement, ImageDefinition } from '../../types';
import Operation from '../operation';
import { AlphaConfig } from './types';

export const magickOptions = (config: AlphaConfig, _: ImageDefinition): string[] => {
  return [
    'magick',
    '-',
    '-alpha', 'set',
    '-channel', 'A',
    '-evaluate', 'multiply', `${config.opacity as number}`,
    '+channel',
    `png:-`,
  ];
};
export const transformState = (_: AlphaConfig, state: ImageDefinition): ImageDefinition => {
  return {
    ...state,
    type: 'png',
  };
};

export default class Alpha implements Operation {
  public config: AlphaConfig;
  constructor(config: AlphaConfig) {
    this.config = config;
  }

  public requirements(): DefinitionRequirement {
    return {};
  }

  public execute(state: ImageDefinition): { command: string, state: ImageDefinition } {
    const options = magickOptions(this.config, state);
    console.log(options);
    return {
      state: transformState(this.config, state),
      command: options.join(' '),
    };
  }
}

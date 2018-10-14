import uuid from 'uuid/v1';
import { DefinitionRequirement, ImageDefinition } from '../../types';
import Operation from '../operation';
import { ComposeConfig } from './types';

export const magickOptions = (handle: string, config: ComposeConfig, _: ImageDefinition): string[] => {
  return [
    'magick',
    'composite',
    '-compose atop',
    '-gravity', 'center',
    handle,
    '-',
    '-',
  ];
};
export const transformState = (config: ComposeConfig, state: ImageDefinition): ImageDefinition => {
  return {
    ...state,
  };
};

export default class Compose implements Operation {
  public config: ComposeConfig;
  private handle: string;
  constructor(config: ComposeConfig) {
    this.config = config;
    this.handle = `/tmp/${uuid()}`;
  }

  public requirements(): DefinitionRequirement {
    return {
      sources: [{
        source: this.config.source,
        handle: this.handle,
        ...this.config.params && {
          params: this.config.params,
        },
      }],
    };
  }

  public execute(state: ImageDefinition): { command: string, state: ImageDefinition } {
    const options = magickOptions(this.handle, this.config, state);
    return {
      state: transformState(this.config, state),
      command: options.join(' '),
    };
  }
}

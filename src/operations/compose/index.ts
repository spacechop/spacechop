import uuid from 'uuid/v1';
import { DefinitionRequirement, ExtraRequirement, ImageDefinition } from '../../types';
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

export const transformState = (_: ComposeConfig, state: ImageDefinition): ImageDefinition => {
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
    return {};
  }

  public execute(state: ImageDefinition): {
    command: string,
    state: ImageDefinition,
    extra: ExtraRequirement,
  } {
    const options = magickOptions(this.handle, this.config, state);
    return {
      state: transformState(this.config, state),
      command: options.join(' '),
      extra: {
        sources: [{
          state,
          handle: this.handle,
          ...this.config,
        }],
      },
    };
  }
}

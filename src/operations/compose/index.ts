import uuid from 'uuid/v1';
import { getMagickOffset, magickGravityMap } from '../../lib/magick';
import { MagickOffset } from '../../lib/magick/getMagickOffset';
import magickArrangementMap from '../../lib/magick/magickArrangementMap';
import magickComposeMap from '../../lib/magick/magickComposeMap';
import { DefinitionRequirement, ExtraRequirement, Gravity, ImageDefinition } from '../../types';
import Operation from '../operation';
import { ComposeConfig } from './types';

export const magickOptions = (handle: string, config: ComposeConfig, state: ImageDefinition): string[] => {
  const gravity = config.gravity as Gravity;
  const width = 3945;
  const heigth = 1700;
  return [
    'magick',
    '-size', `${width}x${heigth} canvas:transparent`,
    '-',
    `-gravity ${magickGravityMap[gravity]}`,
    '-geometry', `${state.width}x${state.height}${getMagickOffset(config.offset as MagickOffset)}`,
    // '-profile', profile,
    '-composite',
    handle,
    ...config.arrange ? ['-compose', magickArrangementMap[config.arrange]] : [
      '-compose', 'dst-over',
    ],
    ...config.blend ? ['-compose', magickComposeMap[config.blend]] : [],
    // // '-watermark', '10', // %
    ...state.profile ? ['-profile', state.profile] : [],
    '-composite',
    `${state.type}:-`,
  ];
};

export const transformState = (_: ComposeConfig, state: ImageDefinition): ImageDefinition => {
  return {
    ...state,
  };
};

export const defaultConfig: ComposeConfig = {
  source: null,
  arrange: 'over',
};

export default class Compose implements Operation {
  public config: ComposeConfig;
  private handle: string;
  constructor(config: ComposeConfig) {
    this.config = { ...defaultConfig, ...config };
    this.handle = `/tmp/${uuid()}`;
  }

  public requirements(_: ImageDefinition): DefinitionRequirement {
    return {
      profile: true,
    };
  }

  public execute(state: ImageDefinition): {
    command: string,
    state: ImageDefinition,
  } {
    const options = magickOptions(this.handle, this.config, state);
    return {
      state: transformState(this.config, state),
      command: options.join(' '),
    };
  }
}

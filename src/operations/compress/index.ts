import { DefinitionRequirement, ImageDefinition } from '../../types';
import Operation from './../operation';
import { CompressConfig } from './types';

const shouldInterlace = (state: ImageDefinition): boolean => {
  if (state.type === 'jpeg') {
    // estimate number of bytes in picture.
    const estimateSize = state.width * state.height;
    return estimateSize > 10000;
  }
  return false;
};

export const mozjpegOptions = (config: CompressConfig, state: ImageDefinition): string[] => {
  return [
    'mozjpeg',
    `-quality ${config.quality}`,
    '|',
    'magick',
    '-',
    '-sampling-factor',
    '4:2:0',
    '-strip',
    `-quality ${config.quality}`,
    ...shouldInterlace(state) ? ['-interlace', 'JPEG'] : [],
    '-colorspace',
    'sRGB',
    ...state.profile ? ['-profile', state.profile] : [],
    `${state.type}:-`,
  ];
};

export const pngquantOptions = (config: CompressConfig, state: ImageDefinition): string[] => {
  return [
    'pngquant',
    `--quality=65-${config.quality}`,
    '--speed 3',
    '-',
  ];
};

export const gifsicleOptions = (config: CompressConfig, state: ImageDefinition): string[] => {
  return [
    'gifsicle',
    '-O3',
    ...config.lossy ? ['--lossy=80'] : [],
    '-',
  ];
};

export const magickOptions = (config: CompressConfig, state: ImageDefinition): string[] => {
  return [
    'magick',
    '-',
    `-quality ${config.quality}`,
    `${state.type}:-`,
  ];
};


export const transformState = (_, state: ImageDefinition): ImageDefinition => {
  return {
    ...state,
    interlacing: shouldInterlace(state),
  };
};

export const defaultConfig: CompressConfig = {
  lossy: false,
  quality: 100,
};

export default class Compress implements Operation {
  public config: CompressConfig;
  constructor(config: CompressConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  public requirements(state: ImageDefinition): DefinitionRequirement {
    return {
      profile: state.type === 'jpeg',
    };
  }

  public execute(state: ImageDefinition): { command: string, state: ImageDefinition } {
    let options;
    switch (state.type) {
      case 'jpeg':
        options = mozjpegOptions(this.config, state);
        break;

      case 'png':
        options = pngquantOptions(this.config, state);
        break;

      case 'gif':
        options = gifsicleOptions(this.config, state);
        break;

      case 'webp':
        options = magickOptions(this.config, state);
        break;
    }

    return {
      command: options.join(' '),
      state: transformState(this.config, state),
    };
  }
}

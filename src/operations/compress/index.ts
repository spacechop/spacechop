import Operation from './../operation';
import ImageDefinition, { DefinitionRequirement, ImageType } from '../../imagedef';
import { magickTypeMap } from '../magickTypeMap';

export interface CompressConfig {
  quality?: number,
  lossy?: boolean,
};

export const mozjpegOptions = (config: CompressConfig, state: ImageDefinition): Array<String> => {
  return [
    'mozjpeg',
    `-quality ${config.quality}`,
  ];
};

export const pngquantOptions = (config: CompressConfig, state: ImageDefinition): Array<String> => {
  return [
    'pngquant',
    '--speed 10',
    '-',
  ];
};

export const gifsicleOptions = (config: CompressConfig, state: ImageDefinition): Array<String> => {
  return [
    'gifsicle',
    '-O3',
    ...config.lossy ? ['--lossy=80'] : [],
    '-',
  ];
};

export const magickOptions = (config: CompressConfig, state: ImageDefinition): Array<String> => {
  return [
    'magick',
    '-',
    `-quality ${config.quality}`,
    `${magickTypeMap[state.type]}:-`,
  ];
};


export const transformState = (_, state: ImageDefinition) : ImageDefinition => {
  return {
    ...state,
  }
}

export const defaultConfig: CompressConfig = {
  quality: 100,
  lossy: false,
};

export default class Compress extends Operation {
  config: CompressConfig;
  constructor(config: CompressConfig) {
    super({ ...defaultConfig, ...config });
  }

  requirements(): [DefinitionRequirement?] {
    return [];
  }

  execute(state: ImageDefinition): { command: String, state: ImageDefinition } {
    let options;
    switch (state.type) {
      case ImageType.jpeg:
        options = mozjpegOptions(this.config, state);
        break;

      case ImageType.png:
        options = pngquantOptions(this.config, state);
        break;

      case ImageType.gif:
        options = gifsicleOptions(this.config, state);
        break;

      case ImageType.webp:
        options = magickOptions(this.config, state);
        break;
      default:
        throw new Error(
          `Compresss cant handle type ${state.type}`
        );
    }

    return {
      state: transformState(this.config, state),
      command: options.join(' '),
    };
  }
}

import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
import { Gravity } from '../Gravity';
import { magickGravityMap } from '../magickGravityMap';
import Operation from './../operation';
import { CropConfig } from './types';

export const magickOptions = (config: CropConfig, state: ImageDefinition): string[] => {
  const width = config.width === undefined ? state.width : config.width as number;
  const height = config.height === undefined ? state.height : config.height as number;
  const gravity = config.gravity as Gravity;

  const geometry = `${width}x${height}+0+0`;
  return [
    '-',
    `-gravity ${magickGravityMap[gravity]}`,
    `-crop ${geometry}`,

    // magick crop only changes the image size, but not the canvas's.
    // using repage solves this.
    // If repage was not used, the true image size (that is widthxheight) would still
    // be the same, but the "projected" image would be correct size.
    `-repage ${geometry}`,
    `${state.type}:-`,
  ];
};

export const transformState = (config: CropConfig, state: ImageDefinition): ImageDefinition => {
  const width = config.width === undefined ? state.width : config.width as number;
  const height = config.height === undefined ? state.height : config.height as number;
  return {
    ...state,
    width,
    height,
  };
};

export const defaultConfig: CropConfig = {
  gravity: 'center',
};

export default class Crop implements Operation {
  public config: CropConfig;
  constructor(config: CropConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  public requirements(): DefinitionRequirement[] {
    if (this.config.gravity === 'face') {
      return [ DefinitionRequirement.FACES ];
    }
    return [];
  }

  public execute(state: ImageDefinition): { command: string, state: ImageDefinition } {
    const options = magickOptions(this.config, state);
    return {
      state: transformState(this.config, state),
      command: 'magick ' + options.join(' '),
    };
  }
}

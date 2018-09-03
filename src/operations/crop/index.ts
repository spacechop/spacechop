import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
import { magickGravityMap } from '../magickGravityMap';
import Operation from './../operation';
import { CropConfig } from './types';
import { Gravity } from '../Gravity';

export const magickOptions = (config: CropConfig, state: ImageDefinition): string[] => {
  const width = config.width === undefined ? state.width : <number>config.width;
  const height = config.height === undefined ? state.height : <number>config.height;
  const gravity = <Gravity> config.gravity;

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
  const width = config.width === undefined ? state.width : <number>config.width;
  const height = config.height === undefined ? state.height : <number>config.height;
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

import { FitConfig } from '@spacechop/types';
import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
import transformFace from '../../lib/face-detection/transformFace';
import Operation from './../operation';

export const magickOptions = (config: FitConfig, state: ImageDefinition): string[] => {
  const width = config.width === undefined ? '' : config.width;
  const height = config.height === undefined ? '' : config.height;
  return [
    '-',
    `-resize ${width}x${height}`,
    `${state.type}:-`,
  ];
};

export const transformState = (config: FitConfig, state: ImageDefinition): ImageDefinition => {
  let width = config.width as number;
  let height = config.height as number;
  let scale = 1;

  if (width && !height) {
    // calculate height to keep aspect ratio.
    scale = width / state.width;
    height = state.height * scale;
  } else if (!width && height) {
    // calculate width to keep aspect ratio.
    scale = height / state.height;
    width = state.width * scale;
  } else {
    scale = state.width > state.height ?
      state.width / (config.width as number) : state.height / (config.height as number);
  }
  return {
    ...state,
    width,
    height,
    ...state.faces && {
      faces: state.faces.map(transformFace([{ scale: { scale } }])),
    },
  };
};

export const defaultConfig: FitConfig = {
};

export default class Crop implements Operation {
  public config: FitConfig;
  constructor(config: FitConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  public requirements(): DefinitionRequirement[] {
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

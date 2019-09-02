import { DefinitionRequirement, ImageDefinition } from '../../types';
import Operation from './../operation';
import { RotateConfig } from './types';
import transformFace from '../../lib/face-detection/transformFace';

const getRotationScale = (config: RotateConfig, state: ImageDefinition): {
  width: number,
  height: number,
  scale: number,
} => {
  let width = state.width;
  let height = state.height;
  let scale = 1;
  const orientation = state.exif && state.exif.Orientation || 0;
  if (config.angle === 'auto') {
    switch (orientation) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        break;
      case 5:
      case 6:
      case 7:
      case 8:
        width = state.height;
        height = state.width;
        break;
    }
  } else if (config.angle >= -180 && config.angle <= 180) {
    const angle = Math.abs(config.angle as number) * (Math.PI / 180) % (Math.PI / 2);
    scale = Math.cos(angle) + (width / height) * Math.sin(angle);
    if (width < height) {
      scale = Math.cos(angle) + (height / width) * Math.sin(angle);
    }
  }
  return {
    width,
    height,
    scale,
  };
};

export const magickOptions = (config: RotateConfig, state: ImageDefinition): string[] => {
  if (config.angle === 'auto') {
    return [
      '-',
      `-auto-orient`,
      `${state.type}:-`,
    ];
  } else {
    const { width, height, scale } = getRotationScale(config, state);
    return [
      '-',
      `-rotate ${config.angle}`,
      `-resize ${Math.ceil(scale * 100)}%`,
      '-gravity center',
      `-extent ${width}x${height}`,
      `${state.type}:-`,
    ];
  }
};

export const transformState = (config: RotateConfig, state: ImageDefinition): ImageDefinition => {
  const { width, height, scale } = getRotationScale(config, state);
  return {
    ...state,
    width,
    height,
    ...state.faces && {
      faces: state.faces.map(transformFace([{ scale: { scale } }])),
    },
  };
};

export const defaultConfig: RotateConfig = {
  angle: 0,
};

export default class Crop implements Operation {
  public config: RotateConfig;
  constructor(config: RotateConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  public requirements(): DefinitionRequirement[] {
    return ['exif'];
  }

  public execute(state: ImageDefinition): { command: string, state: ImageDefinition } {
    const options = magickOptions(this.config, state);
    return {
      state: transformState(this.config, state),
      command: 'magick ' + options.join(' '),
    };
  }
}

import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
import getLargestFaceGravityTranslation from '../../lib/getLargestFaceGravityTranslation';
import getMagickOffset from '../../lib/getMagickOffset';
import transformFace from '../../lib/transformFace';
import { Gravity } from '../Gravity';
import { magickGravityMap } from '../magickGravityMap';
import Operation from './../operation';
import { CropConfig } from './types';

const gravityTransform = (config: CropConfig, state: ImageDefinition) => {
  let translate;
  let clip;
  if (config.gravity === 'face') {
    translate = getLargestFaceGravityTranslation(
      config.width as number,
      config.height as number,
      {
        ...state,
        width: state.width,
        height: state.height,
      },
      state.faces || [],
    );
    const clipVertical = config.width ? (state.width - (config.width as number)) / 2 : 0;
    const clipHorizontal = config.height ? (state.height - (config.height as number)) / 2 : 0;
    clip = {
      top: clipVertical,
      left: clipHorizontal,
      right: clipHorizontal,
      bottom: clipVertical,
    };
  }

  return {
    translate,
    clip,
  };
};

export const magickOptions = (config: CropConfig, state: ImageDefinition): string[] => {
  const width = config.width === undefined ? state.width : config.width as number;
  const height = config.height === undefined ? state.height : config.height as number;
  const gravity = config.gravity as Gravity;
  const { translate } = gravityTransform(config, state);
  const offset = getMagickOffset(translate);
  const geometry = `${width}x${height}${offset}`;
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
  const { translate, clip } = gravityTransform(config, state);
  return {
    ...state,
    width,
    height,
    ...state.faces && {
      faces: state.faces.map(transformFace([
        ...translate ? [{ translate: { x: -translate.x, y: -translate.y } }] : [],
        ...clip ? [{ translate: { x: -clip.left, y: -clip.top } }] : [],
      ])),
    },
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
      return ['faces'];
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

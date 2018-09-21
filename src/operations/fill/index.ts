import ImageDefinition, { DefinitionRequirement } from '../../imagedef';
import getLargestFaceGravityTranslation from '../../lib/getLargestFaceGravityTranslation';
import getMagickOffset from '../../lib/getMagickOffset';
import scaleFace from '../../lib/scaleFace';
import transformFace from '../../lib/transformFace';
import { Gravity } from '../Gravity';
import { magickGravityMap } from '../magickGravityMap';
import Operation from './../operation';
import { FillConfig } from './types';

const gravityTransform = (config: FillConfig, state: ImageDefinition) => {
  const scale = state.width < state.height ?
    state.width / (config.width as number) : state.height / (config.height as number);
  let translate;
  if (config.gravity === 'face') {
    translate = getLargestFaceGravityTranslation(
      config.width as number,
      config.height as number,
      {
        ...state,
        width: state.width / scale,
        height: state.height / scale,
      },
      (state.faces || []).map(scaleFace(scale)),
    );
  }

  return {
    scale,
    translate,
  };
};

export const magickOptions = (config: FillConfig, state: ImageDefinition): string[] => {
  const gravity = config.gravity as Gravity;
  const { translate } = gravityTransform(config, state);
  const offset = getMagickOffset(translate);
  return [
    '-',
    `-resize ${config.width}x${config.height}^`,
    `-gravity ${magickGravityMap[gravity]}`,
    `-extent ${config.width}x${config.height}${offset}`,
    `${state.type}:-`,
  ];
};

export const transformState = (config: FillConfig, state: ImageDefinition): ImageDefinition => {
  const { translate, scale } = gravityTransform(config, state);
  return {
    ...state,
    width: config.width as number,
    height: config.height as number,
    ...state.faces && {
      faces: state.faces.map(transformFace([
        { scale },
        { translate: { x: -translate.x, y: -translate.y } },
      ])),
    },
  };
};

export const defaultConfig: FillConfig = {
  width: 99999,
  height: 99999,
  gravity: 'center',
};

export default class Fill implements Operation {
  public config: FillConfig;
  constructor(config: FillConfig) {
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

import getLargestFace from '../../lib/face-detection/getLargestFace';
import scaleFace from '../../lib/face-detection/scaleFace';
import transformFace from '../../lib/face-detection/transformFace';
import translationForCenteringOnFace from '../../lib/face-detection/translationForCenteringOnFace';
import { getMagickOffset, magickGravityMap } from '../../lib/magick';
import { DefinitionRequirement, Gravity, ImageDefinition } from '../../types';
import Operation from './../operation';
import { FillConfig } from './types';

const gravityTransform = (config: FillConfig, state: ImageDefinition, gravity: Gravity) => {
  const width = config.width as number;
  const height = config.height as number;
  const scale = state.width < state.height ?
    state.width / width : state.height / height;

  if (config.gravity !== 'face' || !state.faces || state.faces.length === 0) {
    return { scale };
  }

  const largestFace = scaleFace({ scale })(getLargestFace(state.faces));
  const newSize = { width, height };
  const scaledSize = {
    width: Math.round(state.width / scale),
    height: Math.round(state.height / scale),
  };

  const translate = translationForCenteringOnFace(
    newSize, scaledSize, largestFace, gravity,
  );

  return { scale, translate };
};

export const magickOptions = (config: FillConfig, state: ImageDefinition): string[] => {
  const gravity = config.gravity as Gravity;
  const { translate } = gravityTransform(config, state, 'center');
  const offset = getMagickOffset(translate);
  return [
    '-',
    `-resize ${config.width}x${config.height}^`,
    `-gravity ${magickGravityMap[gravity]}`,
    // `-extent ${config.width}x${config.height}${offset}`,
    `-crop ${config.width}x${config.height}${offset}`,
    `${state.type}:-`,
  ];
};

export const transformState = (config: FillConfig, state: ImageDefinition): ImageDefinition => {
  const { translate, scale } = gravityTransform(config, state, 'northwest');

  let faces = state.faces;
  if (state.faces) {
    faces = state.faces.map(transformFace([
      { scale: { scale } },
      ...translate ? [{ translate: { x: -translate.x, y: -translate.y } }] : [],
    ]));
  }
  return {
    ...state,
    width: config.width as number,
    height: config.height as number,
    faces,
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

  public requirements(): DefinitionRequirement {
    if (this.config.gravity === 'face') {
      return { faces: true };
    }
    return {};
  }

  public execute(state: ImageDefinition): { command: string, state: ImageDefinition } {
    const options = magickOptions(this.config, state);
    return {
      state: transformState(this.config, state),
      command: 'magick ' + options.join(' '),
    };
  }
}

import { ImageFaceBox } from '../imagedef';

export interface TranslateFace {
  x: number;
  y: number;
}

export default (translate: {
  x: number,
  y: number,
}) => (face: ImageFaceBox): ImageFaceBox => {
  return {
    x: Math.round(face.x + translate.x),
    y: Math.round(face.y + translate.y),
    width: face.width,
    height: face.height,
  };
};

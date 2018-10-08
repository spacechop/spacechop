import { ImageFaceBox } from '../../types';
import scaleFace, { ScaleFace } from './scaleFace';
import translateFace, { TranslateFace } from './translateFace';

export interface FaceTransform {
  scale?: ScaleFace;
  translate?: TranslateFace;
}

export default (transforms: FaceTransform[]) => (face: ImageFaceBox): ImageFaceBox => {
  return transforms.reduce((acc, { scale, translate }: FaceTransform) => {
    if (scale) {
      return scaleFace(scale)(acc);
    }
    if (translate) {
      return translateFace(translate)(acc);
    }
    return face;
  }, face);
};

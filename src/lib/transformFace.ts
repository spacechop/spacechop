import { ImageFaceBox } from '../imagedef';
import scaleFace from './scaleFace';
import translateFace from './translateFace';

type ScaleFace = number;
interface TranslateFace {
  x: number;
  y: number;
}

interface FaceTransform {
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

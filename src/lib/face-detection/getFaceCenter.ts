import { ImageFaceBox } from '../../types';
import { MagickOffset } from '../magick/getMagickOffset';

export default (
  face: ImageFaceBox,
): MagickOffset => {
  const x = face.x + face.width / 2;
  const y = face.y + face.height / 2;

  return { x, y };
};

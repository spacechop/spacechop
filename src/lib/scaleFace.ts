import { ImageFaceBox } from '../imagedef';

export default (
  scale: number,
) => (face: ImageFaceBox): ImageFaceBox => {
  return {
    x: Math.round(face.x / scale),
    y: Math.round(face.y / scale),
    width: Math.round(face.width / scale),
    height: Math.round(face.height / scale),
  };
};

import { ImageFaceBox } from '../imagedef';

export default (faces: ImageFaceBox[]): ImageFaceBox => {
  if (faces && faces.length > 0) {
    // Find the largest face.
    let face = faces[0];
    faces.forEach(({ width, height }, i) => {
      if (face.width * face.height > width * height) {
        face = faces[i];
      }
    });
    return face;
  }
  return null;
};

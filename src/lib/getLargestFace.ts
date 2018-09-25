import { ImageFaceBox } from '../imagedef';

export default (faces: ImageFaceBox[]): ImageFaceBox => {
  if (faces && faces.length > 0) {
    // Find the largest face.
    let face;
    let max = 0;
    for (let i = 0; i <= faces.length - 1; i++) {
      const area = faces[i].width * faces[i].height;
      if (area > max) {
        max = area;
        face = faces[i];
      }
    }
    return face;
  }
  return null;
};

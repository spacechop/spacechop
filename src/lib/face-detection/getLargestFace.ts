import { ImageFaceBox } from '../../types';

/**
 * Finds the largest face in a list of faces.
 * The largest face is defined as the one with largest area.
 */
export default (faces: ImageFaceBox[]): ImageFaceBox => {
  if (!faces || faces.length === 0) {
    return null;
  }

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
};

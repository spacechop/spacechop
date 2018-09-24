import ImageDefinition, { ImageFaceBox } from '../imagedef';
import getLargestFace from './getLargestFace';

export default (
  width: number,
  height: number,
  state: ImageDefinition,
  faces?: ImageFaceBox[],
) => {
  const face = getLargestFace(faces);
  if (face) {
    const faceCenterX = face.x + face.width / 2;
    const faceCenterY = face.y + face.height / 2;
    // Just move face enough without exceeding the bleed.
    const centerX = width / 2;
    const centerY = height / 2;
    const xMin = (width - state.width);
    const xMax = (state.width - width);
    const xDelta = faceCenterX - centerX;
    const yMin = (height - state.height);
    const yMax = (state.height - height);
    const yDelta = faceCenterY - centerY;
    const x = Math.round(Math.max(xMin, Math.min(xMax, xDelta)));
    const y = Math.round(Math.max(yMin, Math.min(yMax, yDelta)));
    return { x, y };
  }
  return { x: 0, y: 0 };
};

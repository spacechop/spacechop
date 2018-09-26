import { ImageFaceBox } from '../../imagedef';

interface Translation {
  x: number;
  y: number;
}

export default (
  newSize: { width: number, height: number },
  originalSize: { width: number, height: number },
  face: ImageFaceBox,
): Translation => {
  const faceCenterX = face.x + face.width / 2;
  const faceCenterY = face.y + face.height / 2;

  // Just move face enough without exceeding the bleed.
  const centerX = newSize.width / 2;
  const centerY = newSize.height / 2;

  const xDelta = faceCenterX - centerX;
  const yDelta = faceCenterY - centerY;

  const xMin = Math.min(0, newSize.width - originalSize.width);
  const xMax = Math.max(0, originalSize.width - newSize.width);
  const x = Math.round(Math.max(xMin, Math.min(xMax, xDelta)));

  const yMin = Math.min(0, newSize.height - originalSize.height);
  const yMax = Math.max(0, originalSize.height - newSize.height);
  const y = Math.round(Math.max(yMin, Math.min(yMax, yDelta)));

  return { x, y };
};

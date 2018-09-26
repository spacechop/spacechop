import { ImageFaceBox } from '../../imagedef';
import { Gravity } from '../../operations/Gravity';

interface Translation {
  x: number;
  y: number;
}

export default (
  newSize: { width: number, height: number },
  originalSize: { width: number, height: number },
  face: ImageFaceBox,
  gravity: Gravity,
): Translation => {
  const faceCenterX = face.x + face.width / 2;
  const faceCenterY = face.y + face.height / 2;

  // Just move face enough without exceeding the bleed.
  let centerX = originalSize.width / 2;
  let centerY = originalSize.height / 2;
  if (gravity !== 'center') {
    centerX = newSize.width / 2;
    centerY = newSize.height / 2;
  }

  const xDelta = faceCenterX - centerX;
  const yDelta = faceCenterY - centerY;

  let xMin = Math.min(0, (newSize.width - originalSize.width) / 2);
  let xMax = Math.max(0, (originalSize.width - newSize.width) / 2);
  if (gravity !== 'center') {
    xMin = Math.min(0, newSize.width - originalSize.width);
    xMax = Math.max(0, originalSize.width - newSize.width);
  }
  const x = Math.round(Math.max(xMin, Math.min(xMax, xDelta)));

  let yMin = Math.min(0, (newSize.height - originalSize.height) / 2);
  let yMax = Math.max(0, (originalSize.height - newSize.height) / 2);
  if (gravity !== 'center') {
    yMin = Math.min(0, newSize.height - originalSize.height);
    yMax = Math.max(0, originalSize.height - newSize.height);
  }
  const y = Math.round(Math.max(yMin, Math.min(yMax, yDelta)));

  return { x, y };
};

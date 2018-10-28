import { Gravity } from '../types';
import { MagickOffset } from './magick/getMagickOffset';

export default (
  sizeBefore: { width: number, height: number },
  sizeAfter: { width: number, height: number },
  center: { x: number, y: number },
  gravity: Gravity,
): MagickOffset => {
  // Just move center enough without exceeding the bleed.
  let centerX = sizeBefore.width / 2;
  let centerY = sizeBefore.height / 2;
  if (gravity !== 'center') {
    centerX = sizeAfter.width / 2;
    centerY = sizeAfter.height / 2;
  }

  const xDelta = center.x - centerX;
  const yDelta = center.y - centerY;

  let xMin = Math.min(0, (sizeAfter.width - sizeBefore.width) / 2);
  let xMax = Math.max(0, (sizeBefore.width - sizeAfter.width) / 2);
  if (gravity !== 'center') {
    if (/north/.test(gravity)) {
      xMin = 0;
    } else {
      xMin = Math.min(0, sizeAfter.width - sizeBefore.width);
    }
    if (/south/.test(gravity)) {
      xMax = 0;
    } else {
      xMax = Math.max(0, sizeBefore.width - sizeAfter.width);
    }
  }

  const x = Math.round(Math.max(xMin, Math.min(xMax, xDelta)));

  let yMin = Math.min(0, (sizeAfter.height - sizeBefore.height) / 2);
  let yMax = Math.max(0, (sizeBefore.height - sizeAfter.height) / 2);
  if (gravity !== 'center') {
    if (/north/.test(gravity)) {
      yMin = 0;
    } else {
      yMin = Math.min(0, sizeAfter.height - sizeBefore.height);
    }
    if (/south/.test(gravity)) {
      yMax = 0;
    } else {
      yMax = Math.max(0, sizeBefore.height - sizeAfter.height);
    }
  }

  const y = Math.round(Math.max(yMin, Math.min(yMax, yDelta)));

  return { x, y };
};

import { Stream } from 'stream';
import ImageDefinition from '../../imagedef';
import AsyncBuffer from '../../lib/asyncBuffer';
import isGIF from './gif';
import isJPEG from './jpeg';
import isPNG from './png';
import isWEBP from './webp';

const tests = [
  isGIF,
  isJPEG,
  isPNG,
  isWEBP,
];

export default (stream: Stream): Promise<ImageDefinition> => {
  const asyncBuffer = new AsyncBuffer(stream);
  return new Promise((resolve, reject) => {
    tests.map((test) => {
      test(asyncBuffer)
        .then((definition) => {
          if (definition) {
            resolve(definition);
            asyncBuffer.destroy();
          }
        })
        .catch(reject);
    });
  });
};

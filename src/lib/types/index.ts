import { Stream } from 'stream';
import { ImageDefinition } from '../../types';
import isGIF from './gif';
import isJPEG from './jpeg';
import isPNG from './png';
import isWEBP from './webp';
import isOther from './other';
import streamToBuffer from '../streamToBuffer';

const tests = [
  isGIF,
  isJPEG,
  isPNG,
  isWEBP,
  isOther,
];

export default (stream: Stream): Promise<ImageDefinition> => new Promise(async (resolve, reject) => {
  try {
    const buffer = await streamToBuffer(stream);
    for (const test of tests) {
      const result: ImageDefinition = await test(buffer);
      if (result) {
        resolve(result);
        return;
      }
    }
  } catch { }
  reject('Unsupported type');
});

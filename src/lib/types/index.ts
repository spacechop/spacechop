import { Stream } from 'stream';
import ImageDefinition from '../../imagedef';
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

export default (stream: Stream): Promise<any> => new Promise((resolve) => {
  const chunks = [];
  stream.on('data', (chunk) => {
    chunks.push(chunk);
  });
  stream.on('end', async () => {
    const buffer = Buffer.concat(chunks);
    for (const test of tests) {
      const result: ImageDefinition = test(buffer);
      if (result) {
        resolve(result);
        break;
      }
    }
  });
});

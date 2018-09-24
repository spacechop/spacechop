import { spawn } from 'duplex-child-process';
import { Stream } from 'stream';
import uuid from 'uuid/v1';
import ImageDefinition, { ImageFaceBox } from '../imagedef';
import scaleFace from './scaleFace';

export default (
  streamToAnalyze: Stream,
  info: ImageDefinition,
): Promise<ImageFaceBox[]> => new Promise((resolve, reject) => {
  const filepath = `/tmp/${uuid()}.jpg`;
  const command = [
    `magick - -resize 1000x1000\\> ${filepath}`,
    `facedetect ${filepath} -rm`,
  ].join('&&');
  const stream = spawn('sh', ['-c', command]);
  streamToAnalyze.pipe(stream);
  const chunks = [];
  stream.on('data', (chunk) => {
    chunks.push(chunk);
  });
  stream.on('error', (err) => reject(err));
  stream.on('end', () => {
    const buffer = Buffer.concat(chunks).toString('utf8');
    try {
      const data = JSON.parse(buffer);
      const scale = Math.min(1, info.width > info.height ? 1000 / info.width : 1000 / info.height);
      resolve(data.map(({ face }) => scaleFace({ scale })(face)));
    } catch (err) {
      reject(err);
    }
  });
});

import { spawn } from 'duplex-child-process';
import { Stream } from 'stream';
import uuid from 'uuid/v1';
import { ImageDefinition, ImageFaceBox } from '../../types';
import scaleFace from './scaleFace';

/**
 * Detects faces in an image passed as a stream.
 * Supports detecting multiple faces.
 */
export default (
  stream: Stream,
  info: ImageDefinition,
): Promise<ImageFaceBox[]> => new Promise((resolve, reject) => {
  const filepath = `/tmp/${uuid()}.jpg`;

  // Resize original image to 1000x1000 in order to speed up
  // face detection. This changes the position of the faces,
  // so it has to be 'negated' after results has been obtained.
  const command = [
    `magick - -resize 1000x1000\\> ${filepath}`,
    `facedetect ${filepath} -rm`,
  ].join('&&');

  const process = spawn('sh', ['-c', command]);
  stream.pipe(process);
  const chunks = [];
  process.on('data', (chunk) => {
    chunks.push(chunk);
  });
  process.on('error', (err) => reject(err));
  process.on('end', () => {
    const buffer = Buffer.concat(chunks).toString('utf8');
    try {
      const data = JSON.parse(buffer);

      // Negate the scaling performed initially
      const scale = Math.min(1, info.width > info.height ? 1000 / info.width : 1000 / info.height);
      resolve(data.map(({ face }) => scaleFace({ scale })(face)));
    } catch (err) {
      reject(err);
    }
  });
});

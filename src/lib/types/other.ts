import { Stream } from 'stream';
import { ImageDefinition } from '../../types';
import { spawn } from 'duplex-child-process';

const identify = (input: Buffer): Promise<{
  type: string,
  width: number,
  height: number,
  color: string,
  alpha: boolean,
}[]> => new Promise((resolve, reject) => {
  const command = `identify -`;
  const pattern = /^([^ ]+)+ (\d+)x(\d+) [^ ]+ [^ ]+ (\w+)/i;
  const process = spawn('sh', ['-c', command]);
  process.write(input);
  process.end();
  const chunks = [];
  process.on('data', (chunk) => {
    chunks.push(chunk);
  });
  process.on('error', (err) => reject(err));
  process.on('end', () => {
    const buffer = Buffer.concat(chunks).toString('utf8');
    const images = buffer
      .replace(/-=>[^ ]+/ig, '')
      .trim()
      .split(/\n/)
      .map(image => {
        const [, type, width, height, color] = image.match(pattern);
        const alpha = /a$/.test(color);
        return {
          type: type.toLowerCase(),
          width: parseInt(width),
          height: parseInt(height),
          color,
          alpha,
        };
      });
    resolve(images);
  });
});

export default async (buffer: Buffer): Promise<ImageDefinition> => {
  if (!buffer || buffer.length === 0) {
    return;
  }
  try {
    const images = await identify(buffer);
    const type = images[0].type;
    const width = images[0].width;
    const height = images[0].height;
    const alpha = images.some(image => image.alpha);
    const animated = images.length > 1;
    const size = buffer.length;
    const interlacing = false;

    // Change this to add support for more types.
    if (type === 'heic') {
      return {
        width,
        height,
        type,
        alpha,
        animated,
        interlacing,
        size,
      };
    }
  } catch (err) {
    throw new Error('Unsupported type');
  }
};

import { Stream } from 'stream';

export default (stream: Stream): Promise<number> => new Promise((resolve) => {
  let size = 0;
  stream.on('data', (chunk) => {
    size += chunk.length;
  });
  stream.on('end', () => resolve(size));
});

import { Stream } from 'stream';

export default (stream: Stream): Promise<number> => {
  return new Promise((resolve) => {
    let bytes = 0;
    stream.on('data', (data) => {
      bytes += data.length;
    });
    stream.on('end', () => resolve(bytes));
  });
};

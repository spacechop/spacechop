import { Readable } from 'stream';

export default (stream: Readable) => {
  return new Promise((resolve) => {
    let bytes = 0;
    stream.on('data', (data) => {
      bytes += data.length;
    });
    stream.on('end', () => resolve(bytes));
  });
};

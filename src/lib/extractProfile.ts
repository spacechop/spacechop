import { spawn } from 'duplex-child-process';
import { Stream } from 'stream';
import uuid from 'uuid/v1';

export default (stream: Stream): Promise<string> => new Promise((resolve, reject) => {
  const handle = `/tmp/${uuid()}.icc`;
  const process = spawn('sh', ['-c', [
    'magick', '-', handle,
  ].join(' ')]);
  stream.pipe(process);
  process.on('error', (err) => reject(err));
  process.on('finish', () => resolve(handle));
});

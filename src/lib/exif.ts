import { spawn } from 'duplex-child-process';
import { Stream } from 'stream';

export default async (stream: Stream): Promise<any> => new Promise((resolve, reject) => {
  const proc = spawn('exiftool', ['-json', '-n', '-']);
  stream.pipe(proc);
  const buffer = [];
  proc.on('data', (chunk) => {
    buffer.push(chunk);
  });
  proc.on('end', () => {
    const [data] = JSON.parse(Buffer.concat(buffer).toString());
    resolve(data);
  });
});

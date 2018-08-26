import { spawn } from 'duplex-child-process';
import { Stream } from 'stream';

export default async (stream: Stream): Promise<any> => new Promise((resolve, reject) => {
  const proc = spawn('strings');
  stream.pipe(proc);
  proc.on('data', (chunk) => {
    const data = Buffer.concat([chunk]).toString();
    const animated = /acTL/.test(data);
    if (animated) {
      proc.removeAllListeners();
      resolve(animated);
    }
  });
  proc.on('end', () => {
    resolve(false);
  });
});

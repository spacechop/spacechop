import fs from 'fs';
import { Stream } from 'stream';

export default (
  rstream: Stream,
  filepath: string,
): Promise<void> => new Promise(async (resolve, reject) => {
  const wstream = fs.createWriteStream(filepath);
  rstream.pipe(wstream);
  wstream.on('error', reject);
  wstream.on('finish', resolve);
});

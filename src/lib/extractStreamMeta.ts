import { spawn } from 'duplex-child-process';
import { Stream } from 'stream';

export default async (stream: Stream): Promise<any> => new Promise((resolve, reject) => {
  // [1x1+0+0] only analyzes a small portion of the image instead of the full
  // increasing the speed drastically
  const proc = spawn('magick', ['-[1x1+0+0]', 'json:']);
  stream.pipe(proc);
  const buffer = [];
  proc.on('data', (chunk) => {
    console.log('.extractmeta got data');
    buffer.push(chunk);
  });
  proc.on('error', (err) => reject(err));
  proc.on('end', () => {
    let data = Buffer.concat(buffer).toString();
    // fix issues with convert json.
    // replace -nan with null
    data = data.replace(/\-nan/g, 'null');
    // replace originGeometry with string
    data = data.replace(/"originGeometry": ([^,"]+),/g, '"originGeometry": "$1",');
    const json = JSON.parse(data);
    resolve(json);
  });
});

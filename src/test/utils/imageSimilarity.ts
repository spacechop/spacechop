import { Stream } from "stream";
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

type File = Stream | string;

const randomFilename = () => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i=0; i<15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const saveToDisk = (image: Stream) : Promise<string> => {
  const p = path.join('/tmp', randomFilename());
  const out = fs.createWriteStream(p);
  return new Promise(resolve => {
    image.pipe(out).on('finish', () => resolve(p));
  });
}

/**
 *
 * @param command
 * @param args
 * @param options
 */
const magickCompare = (path1:string, path2:string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const stderr = [];
    const proc = spawn('compare', ['-metric', 'SSIM', '-quiet', path1, path2, '/dev/null']);

    // Magick uses stderr to write the comparison, as diff image is piped to stdout.
    // Ignore stdout and only read stderr data
    // It also sets exit_code to 1 for images with warnings, but we ignore that.
    proc.stderr.on('data', d => stderr.push(d));
    proc.on('error', reject);
    proc.on('close', code => {
      if (code === 0 || code == 1) {
        const result:string = Buffer.concat(stderr).toString();
        const numericResult:number = parseFloat(result);
        resolve(numericResult);
        return;
      }

      reject(Buffer.concat(stderr).toString());
    })
  })
}

export default async (image1: File, image2 : File) : Promise<number> => {
  const path1: string = typeof image1 === "string" ? image1 : await saveToDisk(<Stream>image1);
  const path2: string = typeof image2 === "string" ? image2 : await saveToDisk(<Stream>image2);
  const result = await magickCompare(path1, path2);
  return result;
}

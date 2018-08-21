import { createReadStream } from 'fs';
import path from 'path';
import { Readable } from 'stream';
import toMatchImageSnapshot from '../../test/utils/toMatchImageSnapshot';
import imageSimilarity from '../utils/imageSimilarity';
import { transform } from './../../spacechop';

expect.extend({ toMatchImageSnapshot });

const countBytes = (stream: Readable) => {
  return new Promise((resolve) => {
    let bytes = 0;
    stream.on('data', (data) => {
      bytes += data.length;
    });
    stream.on('end', () => resolve(bytes));
  });
};

describe('Transform', () => {
  it('should return original image if empty array of steps is given', async () => {
    const p = path.join(__dirname, '..', 'assets', 'grid.png');
    const source = createReadStream(p);
    const target = await transform(source, []);
    const sim = await imageSimilarity(target, p);

    expect(sim).toBe(1);
  });


  it('should return a non-empty stream', async () => {
    const p = path.join(__dirname, '..', 'assets', 'grid.png');
    const source = createReadStream(p);
    const steps = [
      { $crop: { width: 720 } },
    ];
    const target = await transform(source, steps);
    const numBytes = await countBytes(target);
    expect(numBytes).toBeGreaterThan(0);
  });
});

import { createReadStream } from 'fs';
import path from 'path';
import countBytes from '../../../lib/countBytes';
import assetsFolder from '../../../test/assets/dirname';
import imageSimilarity from '../../../test/utils/imageSimilarity';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';
import transform from '../../index';

expect.extend({ toMatchImageSnapshot });

describe('Transform', () => {
  it('should return original image if empty array of steps is given', async () => {
    const p = path.join(assetsFolder, 'grid.png');
    const source = createReadStream(p);
    const target = await transform(source, []);
    const sim = await imageSimilarity(target, p);

    expect(sim).toBe(1);
  });


  it('should return a non-empty stream', async () => {
    const p = path.join(assetsFolder, 'grid.png');
    const source = createReadStream(p);
    const steps = [
      { $crop: { width: 720 } },
    ];
    const target = await transform(source, steps);
    const numBytes = await countBytes(target);
    expect(numBytes).toBeGreaterThan(0);
  });
});

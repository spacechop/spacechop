import { createReadStream } from 'fs';
import path from 'path';
import assetsFolder from '../../test/assets/dirname';
import countBytes from '../countBytes';


describe('countBytes', () => {
  // The expected contentLength stated below are taken fron 'ls -l'.
  const assets = {
    'grid.jpg': 16762,
    'grid-no-exif.jpg': 3273,
    'grid.png': 19715,
    'grid-interlaced.png': 21825,
    'grid.gif': 2197,
    'grid.webp': 9926,
  };

  for (const asset of Object.keys(assets)) {
    it(`should give correct number of bytes for ${asset}`, async () => {
      const p = path.join(assetsFolder, asset);
      const bytes = await countBytes(createReadStream(p));

      expect(bytes).toBe(assets[asset]);
    });
  }
});

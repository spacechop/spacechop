import { createReadStream } from 'fs';
import path from 'path';
import assetsFolder from '../../test/assets/dirname';
import buildHeaders from '../build-headers';


describe('buildHeaders', () => {
  // The expected contentLength stated below are taken fron 'ls -l'.
  const assets = [
    {
      asset: 'grid.jpg',
      contentType: 'image/jpeg',
      contentLength: 16762,
    },
    {
      asset: 'grid-no-exif.jpg',
      contentType: 'image/jpeg',
      contentLength: 3273,
    },
    {
      asset: 'grid.png',
      contentType: 'image/png',
      contentLength: 19715,
    },
    {
      asset: 'grid-interlaced.png',
      contentType: 'image/png',
      contentLength: 21825,
    },
    {
      asset: 'grid.gif',
      contentType: 'image/gif',
      contentLength: 2197,
    },
    {
      asset: 'grid.webp',
      contentType: 'image/webp',
      contentLength: 9926,
    },
  ];
  for (const asset of assets) {
    describe(asset.asset, () => {
      const p = path.join(assetsFolder, asset.asset);
      let result;
      beforeAll(async () => {
        result = await buildHeaders(createReadStream(p));
      });

      it(`should return contentType = ${asset.contentType}`, () => {
        expect(result.contentType).toBe(asset.contentType);
      });
      it(`should return contentLength = ${asset.contentLength}`, () => {
        expect(result.contentLength).toBe(asset.contentLength);
      });
    });
  }
});

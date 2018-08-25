import { createReadStream } from 'fs';
import path from 'path';
import ImageDefinition, { Mime } from '../../imagedef';
import assetsFolder from '../../test/assets/dirname';
import { Format } from '../../types/Format';
import buildHeaders from '../build-headers';

describe('buildHeaders', () => {
  // The expected contentLength stated below are taken fron 'ls -l'.
  const assets: Array<{
    asset: string,
    type: Format,
    contentType: Mime,
    contentLength: number,
  }> = [
    {
      asset: 'grid.jpg',
      type: 'jpeg',
      contentType: 'image/jpeg',
      contentLength: 16762,
    },
    {
      asset: 'grid-no-exif.jpg',
      type: 'jpeg',
      contentType: 'image/jpeg',
      contentLength: 3273,
    },
    {
      asset: 'grid.png',
      type: 'png',
      contentType: 'image/png',
      contentLength: 19715,
    },
    {
      asset: 'grid-interlaced.png',
      type: 'png',
      contentType: 'image/png',
      contentLength: 21825,
    },
    {
      asset: 'grid.gif',
      type: 'gif',
      contentType: 'image/gif',
      contentLength: 2197,
    },
    {
      asset: 'grid.webp',
      type: 'webp',
      contentType: 'image/webp',
      contentLength: 9926,
    },
  ];
  for (const asset of assets) {
    describe(asset.asset, () => {
      const definition: ImageDefinition = {
        width: 100,
        height: 100,
        type: asset.type,
        mime: asset.contentType,
      };
      const p = path.join(assetsFolder, asset.asset);
      let result;
      beforeAll(async () => {
        result = await buildHeaders(createReadStream(p), definition);
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

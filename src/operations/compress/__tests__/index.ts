import { allFormats, CompressConfig } from '@spacechop/types';
import fs from 'fs';
import path from 'path';
import probeImageSize from 'probe-image-size';
import { PassThrough } from 'stream';
import Compress from '..';
import ImageDefinition from '../../../imagedef';
import countStreamBytes from '../../../test/utils/countStreamBytes';
import createTransformedStream from '../../../test/utils/createTransformedStream';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';

expect.extend({ toMatchImageSnapshot });

describe('Compress', () => {
  describe('Requirements', () => {
    it('should not have any requirements', () => {
      const compress = new Compress({});
      expect(compress.requirements()).toEqual([]);
    });
  });

  const defaultConfig: CompressConfig = {};
  const defaultState: ImageDefinition = { width: 100, height: 100, type: 'jpeg' };

  const assets = '../../../test/assets';
  const sources = {
    jpeg: path.join(__dirname, assets, 'grid.jpg'),
    png: path.join(__dirname, assets, 'grid.png'),
    gif: path.join(__dirname, assets, 'grid.gif'),
    webp: path.join(__dirname, assets, 'grid.webp'),
  };

  // create a test for all file types
  for (const type of allFormats) {
    describe(`Compressing ${type}`, async () => {

      const resultCopies = [];
      const numberOfCopies = 3;
      let stats;
      let state;

      beforeAll(() => {
        // create operation with config.
        const operation = new Compress({ ...defaultConfig });
        // select source image to use.
        const source = sources[type];
        // set current state of source image.
        state = { ...defaultState, type };
        // get source file size.
        stats = fs.statSync(source);

        // do the transformation operation.
        const result = createTransformedStream(source, operation, state);
        for (let i = 0; i < numberOfCopies; i++) {
          const pt = new PassThrough();
          result.pipe(pt);
          resultCopies.push(pt);
        }
      });

      it('should match snapshot', async () => {
        await expect(resultCopies[0]).toMatchImageSnapshot({ extension: type });
      });

      it('should be smaller in size than source', async () => {
        const size = await countStreamBytes(resultCopies[1]);
        expect(size).toBeLessThan(stats.size);
      });

      it('should match source mime', async () => {
        // measure mime type and image size to match source.
        const meta = await probeImageSize(resultCopies[2]);
        expect(meta.mime).toBe(`image/${state.type}`);
      });
    });
  }
});

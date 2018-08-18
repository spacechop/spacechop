import fs from 'fs';
import path from 'path';
import probeImageSize from 'probe-image-size';
import { PassThrough } from 'stream';
import Compress, { CompressConfig } from '..';
import ImageDefinition, { ImageType } from '../../../imagedef';
import countStreamBytes from '../../../test/utils/countStreamBytes';
import createTransformedStream from '../../../test/utils/createTransformedStream';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';

expect.extend({ toMatchImageSnapshot });

describe('Compress', () => {
  const defaultConfig: CompressConfig = {};
  const defaultState: ImageDefinition = { width: 100, height: 100, type: ImageType.jpeg };

  const __assets = '../../../test/assets';
  const sources = {
    jpeg: path.join(__dirname, __assets, 'grid.jpg'),
    png: path.join(__dirname, __assets, 'grid.png'),
    gif: path.join(__dirname, __assets, 'grid.gif'),
    webp: path.join(__dirname, __assets, 'grid.webp'),
  };

  // create a test for all file types
  for (const type of Object.keys(ImageType)) {
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
        state = { ...defaultState, type: ImageType[type] };
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

import path from 'path';
import probeImageSize from 'probe-image-size';
import { PassThrough } from 'stream';
import Format from '..';
import createTransformedStream from '../../../test/utils/createTransformedStream';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';
import { ImageDefinition } from './../../../types';
import { allFormats } from './../../../types/Format';

expect.extend({ toMatchImageSnapshot });

describe('Format', () => {
  describe('Requirements', () => {
    it('should not have any requirements', () => {
      const compress = new Format({ type: 'jpeg' });
      expect(compress.requirements()).toEqual([]);
    });
  });
  describe('Transformation of state', () => {
    it('should not return same state', () => {
      const r = new Format({ type: 'png' });
      const stateBefore: ImageDefinition = { width: 100, height: 100, type: 'jpeg' };
      const { state: stateAfter } = r.execute(stateBefore);
      expect(stateBefore === stateAfter).toBe(false);
    });

    const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };
    it('should not update width & height', () => {
      const op = new Format({ type: 'png' });
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        width: 400,
        height: 400,
      }));
    });

    it('should update type', () => {
      const op = new Format({ type: 'png' });
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        type: 'png',
      }));
    });
  });

  describe('Command', () => {
    const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg'};

    it('should use width & height', () => {
      const op = new Format({ type: 'png'});
      const { command } = op.execute(defaultState);
      expect(command).toEqual(expect.stringMatching(/png:-/));
    });

  });



  const assetsFolder = path.join(__dirname, '../../../test/assets');
  const inputPaths = {
    jpeg: path.join(assetsFolder, 'grid.jpg'),
    png: path.join(assetsFolder, 'grid.png'),
    gif: path.join(assetsFolder, 'grid.gif'),
    webp: path.join(assetsFolder, 'grid.webp'),
  };


  // Test converting between different formats
  for (const fromFormat of allFormats) {
    for (const toFormat of allFormats) {

      // Dont perform noop conversions
      if (fromFormat === toFormat) { continue; }


      describe(`conversion between [${fromFormat}] and [${toFormat}]`, async () => {

        const resultCopies = [];
        const numberOfCopies = 2;
        beforeAll(() => {
          const result = createTransformedStream(
            inputPaths[fromFormat],
            new Format({ type: toFormat }),
            { width: 100, height: 100, type: fromFormat },
          );

          for (let i = 0; i < numberOfCopies; i++) {
            const pt = new PassThrough();
            result.pipe(pt);
            resultCopies.push(pt);
          }

        });

        it('should match snapshot', async () => {
          await expect(resultCopies[0]).toMatchImageSnapshot({ extension: toFormat });
        });

        it(`it should have correct type [${toFormat}]`, async () => {
          const meta = await probeImageSize(resultCopies[1]);
          expect(meta.mime).toBe(`image/${toFormat}`);
        });
      });
    }
  }
});

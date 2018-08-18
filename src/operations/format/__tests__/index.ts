import path from 'path';
import probeImageSize from 'probe-image-size';
import { PassThrough } from 'stream';
import createTransformedStream from '../../../test/utils/createTransformedStream';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';
import ImageDefinition, { DefinitionRequirement, ImageType } from './../../../imagedef';
import Format, { FormatConfig } from './../index';

expect.extend({ toMatchImageSnapshot });

describe('Fill', () => {
  describe('Transformation of state', () => {
    it('should not return same state', () => {
      const r = new Format({ type: ImageType.png });
      const stateBefore: ImageDefinition = { width: 100, height: 100, type: ImageType.jpeg };
      const { state: stateAfter } = r.execute(stateBefore);
      expect(stateBefore === stateAfter).toBe(false);
    });

    const defaultState: ImageDefinition = { height: 400, width: 400, type: ImageType.jpeg };
    it('should not update width & height', () => {
      const op = new Format({ type: ImageType.png });
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        width: 400,
        height: 400,
      }));
    });

    it('should update type', () => {
      const op = new Format({ type: ImageType.png });
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        type: ImageType.png,
      }));
    });
  });

  describe('Command', () => {
    const defaultState: ImageDefinition = { height: 400, width: 400, type: ImageType.jpeg };

    it('should use width & height', () => {
      const op = new Format({ type: ImageType.png });
      const { command } = op.execute(defaultState);
      expect(command).toEqual(expect.stringMatching(/PNG:-/));
    });

  });



  const assetsFolder = path.join(__dirname, '../../../test/assets');
  const inputPaths = {
    [ImageType.jpeg]: path.join(assetsFolder, 'grid.jpg'),
    [ImageType.png]: path.join(assetsFolder, 'grid.png'),
    [ImageType.gif]: path.join(assetsFolder, 'grid.gif'),
    [ImageType.webp]: path.join(assetsFolder, 'grid.webp'),
  };


  // Test converting between different formats
  for (const fromFormat of Object.keys(inputPaths)) {
    for (const toFormat of Object.keys(inputPaths)) {

      // Dont perform noop conversions
      if (fromFormat === toFormat) { continue; }


      describe(`conversion between [${fromFormat}] and [${toFormat}]`, async () => {

        const resultCopies = [];
        const numberOfCopies = 2;
        beforeAll(() => {
          const result = createTransformedStream(
            inputPaths[fromFormat],
            new Format({ type: ImageType[toFormat] }),
            { width: 100, height: 100, type: ImageType[fromFormat] },
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

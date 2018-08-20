import path from 'path';
import analyze from '../analyze';
import ImageDefinition, { ImageType } from '..';
import { createReadStream } from 'fs';

describe('ImageDefinition', () => {
  describe('Analyze', () => {
    describe('regular files', () => {
      const __assets = '../../test/assets';
      const sources = [
        {
          source: 'grid.jpg',
          alpha: false,
          interlacing: false,
          root: __assets,
          type: 'jpeg',
          width: 100,
          height: 100,
        }, {
          source: 'grid-no-exif.jpg',
          alpha: false,
          interlacing: false,
          root: __assets,
          type: 'jpeg',
          width: 100,
          height: 100,
        }, {
          source: 'grid.png',
          alpha: true,
          interlacing: false,
          root: __assets,
          type: 'png',
          width: 100,
          height: 100,
        }, {
          source: 'grid.gif',
          alpha: false,
          interlacing: false,
          root: __assets,
          type: 'gif',
          width: 100,
          height: 100,
        }, {
          source: 'grid.webp',
          alpha: false,
          interlacing: false,
          root: __assets,
          type: 'webp',
          width: 100,
          height: 100,
        },
      ];

      // create a test for all file types
      for (const {
        source,
        width,
        height,
        alpha,
        interlacing,
        type,
        root,
      } of sources) {
        it(`should return valid ImageDefinition for ${source}`, async () => {
          const expected: ImageDefinition = {
            width,
            height,
            type: ImageType[type],
            alpha,
            interlacing,
          };
          const stream = createReadStream(path.join(__dirname, root, source));
          const recieved = await analyze(stream, []);
          expect(recieved).toEqual(
            expect.objectContaining(expected),
          );
        });
      }
    });
  });
});

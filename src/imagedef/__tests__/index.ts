import { createReadStream } from 'fs';
import path from 'path';
import ImageDefinition, { ImageType } from '..';
import analyze from '../analyze';
describe('ImageDefinition', () => {
  describe('Analyze', () => {
    describe('Basic files', () => {
      const assets = '../../test/assets';
      const sources = [
        {
          source: 'grid.jpg',
          alpha: false,
          interlacing: false,
          root: assets,
          type: 'jpeg',
          width: 100,
          height: 100,
        }, {
          source: 'grid-no-exif.jpg',
          alpha: false,
          interlacing: false,
          root: assets,
          type: 'jpeg',
          width: 100,
          height: 100,
        }, {
          source: 'grid.png',
          alpha: true,
          interlacing: false,
          root: assets,
          type: 'png',
          width: 100,
          height: 100,
        }, {
          source: 'grid.gif',
          alpha: false,
          interlacing: false,
          root: assets,
          type: 'gif',
          width: 100,
          height: 100,
        }, {
          source: 'grid.webp',
          alpha: false,
          interlacing: false,
          root: assets,
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

    describe('Stream reusability', () => {
      console.log('s');
    });
  });
});

import { createReadStream } from 'fs';
import path from 'path';
import ImageDefinition from '..';
import toMatchImageSnapshot from '../../test/utils/toMatchImageSnapshot';
import { Format } from '../../types/Format';
import analyze from '../analyze';

expect.extend({ toMatchImageSnapshot });

describe('ImageDefinition', () => {
  describe('Analyze', () => {
    describe('Basic files', () => {
      const assets = '../../test/assets';
      const sources: Array<{
        source: string;
        alpha: boolean;
        interlacing: boolean;
        root: string,
        type: Format,
        width: number,
        height: number
      }> = [
        {
          source: 'grid.jpg',
          alpha: false,
          interlacing: false,
          root: assets,
          type: 'jpeg',
          width: 100,
          height: 100,
          animated: false,
        }, {
          source: 'grid-no-exif.jpg',
          alpha: false,
          interlacing: false,
          root: assets,
          type: 'jpeg',
          width: 100,
          height: 100,
          animated: false,
        }, {
          source: 'grid.png',
          alpha: true,
          interlacing: false,
          root: assets,
          type: 'png',
          width: 100,
          height: 100,
          animated: false,
        }, {
          source: 'grid.gif',
          alpha: false,
          interlacing: false,
          root: assets,
          type: 'gif',
          width: 100,
          height: 100,
          animated: false,
        }, {
          source: 'grid.webp',
          alpha: false,
          interlacing: false,
          root: assets,
          type: 'webp',
          width: 100,
          height: 100,
          animated: false,
        }, {
          source: 'animated.gif',
          alpha: true,
          interlacing: false,
          root: assets,
          type: 'gif',
          width: 100,
          height: 100,
          animated: true,
        }, {
          source: 'animated.png',
          alpha: false,
          interlacing: false,
          root: assets,
          type: 'png',
          width: 100,
          height: 100,
          animated: true,
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
        describe(`analyze ImageDefinition for ${source}`, () => {
          const expected: ImageDefinition = {
            width,
            height,
            type,
            alpha,
            interlacing,
          };
          const stream = createReadStream(path.join(__dirname, root, source));

          it('should return valid ImageDefinition', async () => {
            const recieved = await analyze(stream, []);
            expect(recieved).toEqual(
              expect.objectContaining(expected),
            );
          });
        });
      }
    });
  });
});

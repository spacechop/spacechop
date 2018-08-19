import path from 'path';
import analyze from '../analyze';
import ImageDefinition, { ImageType } from '..';
import { createReadStream } from 'fs';

describe('ImageDefinition', () => {
  describe('analyze', () => {
    const __assets = '../../test/assets';
    const sources = {
      jpeg: path.join(__dirname, __assets, 'grid.jpg'),
      png: path.join(__dirname, __assets, 'grid.png'),
      gif: path.join(__dirname, __assets, 'grid.gif'),
      webp: path.join(__dirname, __assets, 'grid.webp'),
    };

    it('should return valid ImageDefinition', async () => {
      // create a test for all file types
      for (const type of Object.keys(ImageType)) {
        const expected: ImageDefinition = {
          width: 100,
          height: 100,
          type: ImageType[type],
        };
        // select source image to use.
        const source = sources[type];
        const stream = createReadStream(source);
        const recieved = await analyze(stream, []);
        expect(recieved).toEqual(
          expect.objectContaining(expected),
        );
      }
    });
  });
});

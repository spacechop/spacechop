import fs from 'fs';
import path from 'path';
import isStreamPNGAnimation from '../isStreamPNGAnimation';

describe('Extract stream meta', () => {
  describe('animated png', () => {
    const assetsFolder = path.join(__dirname, './../../test/assets');
    const filename = path.join(assetsFolder, 'animated.png');
    const stream = fs.createReadStream(filename);

    it('should detect animated png from data in stream', async () => {
      const animated = await isStreamPNGAnimation(stream);
      expect(animated).toBe(true);
    });
  });

  describe('non animated png', () => {
    const assetsFolder = path.join(__dirname, './../../test/assets');
    const filename = path.join(assetsFolder, 'animated.gif');
    const stream = fs.createReadStream(filename);

    it('should not detect animated png from data in stream', async () => {
      const animated = await isStreamPNGAnimation(stream);
      expect(animated).toBe(false);
    });
  });
});

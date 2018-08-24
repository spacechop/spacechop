import fs from 'fs';
import path from 'path';
import isStreamPNGAnimation from '../isStreamPNGAnimation';

describe('Extract stream meta', () => {
  const assetsFolder = path.join(__dirname, './../../test/assets');
  const filename = path.join(assetsFolder, 'animated.png');
  const stream = fs.createReadStream(filename);
  it('should extract meta data from image', async () => {
    const animated = await isStreamPNGAnimation(stream);
    expect(animated).toBe(true);
  });
});

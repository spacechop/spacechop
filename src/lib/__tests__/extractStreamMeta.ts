import fs from 'fs';
import path from 'path';
import extractStreamMeta from '../extractStreamMeta';

describe('Extract stream meta', () => {
  const assetsFolder = path.join(__dirname, './../../test/assets');
  const filename = path.join(assetsFolder, 'cat.jpg');
  const stream = fs.createReadStream(filename);

  it('should extract meta data from image', async () => {
    const meta = await extractStreamMeta(stream);
    // ignore file properties in extraction.
    delete meta.properties['date:create'];
    delete meta.properties['date:modify'];
    // ignore imagemagick properties
    delete meta.elapsedTime;
    delete meta.pixelsPerSecond;
    delete meta.userTime;
    expect(meta).toMatchSnapshot();
  });

  it('should throw when stream is broken', async () => {
    const empty = fs.createReadStream('/config.yml');
    expect(extractStreamMeta(empty)).rejects.toThrow();
  });
});

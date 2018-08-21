import fs from 'fs';
import path from 'path';
import HttpSource, { buildUri } from '..';
import createMockServer from '../../../test/utils/createMockServer';
import { Stream } from 'stream';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';

expect.extend({ toMatchImageSnapshot });

describe('HTTP Source', () => {
  describe('buildUri', () => {
    const paths = [
      'http://spacechop.com/:image',
      'http://localhost:8080/:image',
    ];

    const params = {
      image: 'test.jpg',
    };

    const expected = [
      'http://spacechop.com/test.jpg',
      'http://localhost:8080/test.jpg',
    ];

    for (let i in paths) {
      const path = paths[i];
      it(`should work with path: ${path}`, () => {
        expect(buildUri(path, params)).toBe(expected[i]);
      });
    }
  });

  describe('config', () => {
    const config = { root: 'http://localhost:9000/:image' };
    const instance = new HttpSource(config);
    const listener = jest.fn();
    const handler = (req, res) => {
      const { image } = req.params;
      const filename = path.join(__dirname, '../../../test/assets', image);
      const exists = fs.existsSync(filename);
      listener(req.originalUrl);
      res.status(exists ? 200 : 404);
      if (exists && req.method === 'GET') {
        const stream = fs.createReadStream(filename);
        stream.pipe(res);
      } else {
        res.end();
      }
    };
    let server;

    beforeAll(async() => {
      server = await createMockServer(9000, handler, '/:image');
    });
    afterAll(async () => {
      await server.close();
    });

    it('should save config', () => {
      expect(instance.config).toEqual(
        expect.objectContaining(config),
      );
    });

    it('should resolve true if file exists', async () => {
      const result = await instance.exists({image: 'cat.jpg' });
      expect(listener).toHaveBeenCalledWith('/cat.jpg');
      expect(result).toBe(true);
    });

    it('should resolve to stream if image exists', async () => {
      const result = instance.stream({image: 'cat.jpg' });
      expect(listener).toHaveBeenCalledWith('/cat.jpg');
      expect(result).toBeInstanceOf(Stream);
      await expect(result).toMatchImageSnapshot({ extension: 'jpg' });
    });
  });
});

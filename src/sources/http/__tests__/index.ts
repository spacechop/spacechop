import fs from 'fs';
import path from 'path';
import { Stream } from 'stream';
import HttpSource, { buildUri } from '..';
import streamToBuffer from '../../../lib/streamToBuffer';
import createMockServer from '../../../test/utils/createMockServer';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';

jest.mock('../../../lib/console');

expect.extend({ toMatchImageSnapshot });

describe('HTTP Source', () => {
  describe('buildUri', () => {

    const params = {
      image: 'test.jpg',
    };
    // path => expected
    const paths = {
      'http://spacechop.com/:image': 'http://spacechop.com/test.jpg',
      'http://localhost:8080/:image': 'http://localhost:8080/test.jpg',
    };

    for (const p of Object.keys(paths)) {
      const expected = paths[p];
      it(`${p} = ${expected}`, () => {
        expect(buildUri(p, params)).toBe(expected);
      });
    }
  });

  describe('Source ok (status 200 and image)', () => {
    const config = { root: 'http://localhost:9000/:image' };
    const instance = new HttpSource(config);
    const filepath = path.join(__dirname, '../../../test/assets/cat.jpg');
    let server;
    beforeAll(async () => {
      server = await createMockServer(9000, (req, res) => {
        const stream = fs.createReadStream(filepath);
        res.status(200);
        stream.pipe(res);
      });
    });

    afterAll(async () => {
      server.close();
    });

    describe('.exists', () => {
      it('should resolve true', async () => {
        const result = await instance.exists({ image: 'some-image.jpg' });
        expect(result).toBe(true);
      });
    });

    describe('.key', () => {
      it('should return key', async () => {
        // console.log(source);
        const result = instance.key({ image: 'some-image.jpg' });
        expect(result).toMatch(/.+/);
      });
    });

    describe('.stream', () => {
      const result = instance.stream({ image: 'some-image.jpg' });

      it('should return a stream', () => {
        expect(result).toBeInstanceOf(Stream);
      });

      it('should return a stream matching image', async () => {
        const received = streamToBuffer(result);
        const expected = streamToBuffer(fs.createReadStream(filepath));

        expect(received.toString()).toEqual(expected.toString());
      });
    });
  });


  describe('Source failure (status 500)', () => {
    const config = { root: 'http://localhost:9000/:image' };
    const instance = new HttpSource(config);
    let server;
    beforeAll(async () => {
      server = await createMockServer(9000, (req, res) => {
        res.status(500);
        res.end();
      });
    });

    afterAll(async () => {
      server.close();
    });

    describe('.exists', () => {
      it('should resolve false', async () => {
        const result = await instance.exists({ image: 'some-image.jpg' });
        expect(result).toBe(false);
      });
    });
  });

  describe('Source 404', () => {
    const config = { root: 'http://localhost:9000/:image' };
    const instance = new HttpSource(config);
    let server;
    beforeAll(async () => {
      server = await createMockServer(9000, (req, res) => {
        res.status(404);
        res.end();
      });
    });

    afterAll(async () => {
      server.close();
    });

    describe('.exists', () => {
      it('should resolve false', async () => {
        const result = await instance.exists({ image: 'some-image.jpg' });
        expect(result).toBe(false);
      });
    });
  });

  describe('Source misconfigured', () => {
    // For these tests there are no server started at following path.
    const config = { root: 'http://localhost:9000/:image' };
    const instance = new HttpSource(config);

    describe('.exists', () => {
      it('should throw an error', async () => {
        let threwError = false;
        try {
          await instance.exists({ image: 'some-image.jpg' });
        } catch (e) {
          threwError = true;
        }
        expect(threwError).toBe(true);
      });
    });
  });
});

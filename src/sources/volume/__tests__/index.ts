import fs from 'fs';
import path from 'path';
import { Stream } from 'stream';
import VolumeSource, { buildUri } from '..';
import streamToBuffer from '../../../lib/streamToBuffer';

describe('Volume Source', () => {
  describe('buildUri', () => {

    const params = {
      image: 'test.jpg',
    };
    // path => expected
    const paths = {
      '/:image': '/test.jpg',
      '/images/:image': '/images/test.jpg',
    };

    for (const p of Object.keys(paths)) {
      const expected = paths[p];
      it(`${p} = ${expected}`, () => {
        expect(buildUri(p, params)).toBe(expected);
      });
    }
  });

  describe('Source ok (status 200 and image)', () => {
    const config = { root: path.join(__dirname, '../../../test/assets/:image') };
    const instance = new VolumeSource(config);
    const filepath = path.join(__dirname, '../../../test/assets/cat.jpg');

    describe('.exists', () => {
      it('should resolve true', async () => {
        const result = await instance.exists({ image: 'cat.jpg' });
        expect(result).toBe(true);
      });
    });
    describe('.stream', () => {
      const result = instance.stream({ image: 'cat.jpg' });

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

  describe('Source 404', () => {
    const config = { root: path.join(__dirname, '../../../test/assets/:image') };
    const instance = new VolumeSource(config);

    describe('.exists', () => {
      it('should resolve false', async () => {
        const result = await instance.exists({ image: 'some-image.jpg' });
        expect(result).toBe(false);
      });
    });
  });

  describe('Source misconfigured', () => {
    // For these tests the root is misconfigured
    const config = { root: null };
    const instance = new VolumeSource(config);

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

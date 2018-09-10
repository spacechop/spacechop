import { createReadStream } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import S3Storage from '..';
import { S3StorageConfig } from '../types';
import assetsFolder from './../../../test/assets/dirname';

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({

    // Simulates an existing image
    headObject: jest.fn((params, cb) => {
      cb(null, true);
    }),

    // simulates an ok upload
    upload: jest.fn((params, cb) => {
      cb(null, {});
    }),

    // simulates and an existing image with content type set
    getObject: jest.fn((params, cb) => {
      return {
        // getObject should return an EventEmitter but the only thing we are interested in
        // is the httpHeaders event.
        on: jest.fn((event, cb2) => {
          if (event === 'httpHeaders') {
            cb2(200, { 'content-type': 'image/jpeg' });
          }
        }),
        createReadStream: jest.fn(() => {
          const { PassThrough } =  require('stream');
          return new PassThrough();
        }),
      };
    }),
  })),
  Endpoint: jest.fn(),
  config: { update: jest.fn() },
}));

const defaultConfig: S3StorageConfig = {
  access_key_id: 'xxx',
  secret_access_key: 'xxxx',
  region: 'nyc3',
  bucket_name: 'yyy',
  path: ':image',
};
describe('S3 storage - image exists', () => {
  describe('.exists', () => {
    it('should resolve to true', async () => {
      const storage = new S3Storage(defaultConfig);
      const result = await storage.exists({ image: 'hej' });
      expect(result).toBe(true);
    });
  });

  describe('.stream', () => {
    it('should return a stream', async () => {
      const storage = new S3Storage(defaultConfig);
      const result = await storage.stream({ image: 'hej' });
      expect(result.stream).toBeInstanceOf(Readable);
    });
    it('should return a contentType', async () => {
      const storage = new S3Storage(defaultConfig);
      const result = await storage.stream({ image: 'hej' });
      expect(result.contentType).toBe('image/jpeg');
    });
  });

});

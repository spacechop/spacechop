import { createReadStream } from 'fs';
import { join } from 'path';
import S3Storage from '..';
import { S3StorageConfig } from '../types';
import assetsFolder from './../../../test/assets/dirname';

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    // simulates an faulty upload
    upload: jest.fn((params, cb) => {
      const error = new Error('Some error');
      cb(error);
    }),


    // Simulates an faulty head request
    headObject: jest.fn((params, cb) => {
      const error = new Error('Some error');
      cb(error);
    }),

    // simulates and an missing image
    getObject: jest.fn((params, cb) => {
      return {
        // getObject should return an EventEmitter but the only thing we are interested in
        // here is the error event
        on: jest.fn((event, cb2) => {
          if (event === 'error') {
            const error = new Error('Some error');
            cb2(error);
            return;
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
  describe('.upload', () => {
    let stream;
    beforeEach(() => {
      stream = createReadStream(join(assetsFolder, 'grid.jpg'));
    });

    it('should reject', async () => {
      const storage = new S3Storage(defaultConfig);
      let errorThrown;
      try {
        await storage.upload({ image: 'hej' }, stream, 'image/jpeg');
      } catch (err) {
        errorThrown = err;
      }
      expect(errorThrown).toBeDefined();
    });
  });

  describe('.exists', () => {
    it('should resolve to false', async () => {
      const storage = new S3Storage(defaultConfig);
      const result = await storage.exists({ image: 'hej' });
      expect(result).toBe(false);
    });
  });

  describe('.stream', () => {
    it('should reject', async () => {
      const storage = new S3Storage(defaultConfig);
      let errorThrown;
      try {
        await storage.stream({ image: 'hej' });
      } catch (err) {
        errorThrown = err;
      }
      expect(errorThrown).toBeDefined();
    });
  });
});

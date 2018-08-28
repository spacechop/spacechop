import { S3StorageConfig } from "../types";
import S3Storage from "..";
import assetsFolder from './../../../test/assets/dirname';
import { createReadStream } from "fs";
import { join } from "path";
import { Readable } from 'stream';

const mocks = {
  headObject: jest.fn((params, cb) => { cb(null, false); }),

  // mocking a successful upload
  upload: jest.fn((params, cb) => { cb(null, {})})
};

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    headObject: mocks.headObject,
    getObject: jest.fn(() => ({
      createReadStream: jest.fn(() => {
        const { PassThrough } =  require('stream');
        return new PassThrough();
      }),
    })),
    upload: mocks.upload
  })),
  config: { update: jest.fn() },
}));

const defaultConfig: S3StorageConfig = {
  access_key_id: 'xxx',
  secret_access_key: 'xxx',
  region: 'xxx',
  bucket_name: 'xx',
  path: ':image',
};
describe('S3 storage', () => {
  describe('.upload', () => {
    let stream;
    beforeEach(() => {
      stream = createReadStream(join(assetsFolder, 'grid.jpg'));
    });

    it('should call S3.upload', async () => {
      mocks.upload.mockClear();
      const storage = new S3Storage(defaultConfig);
      await storage.upload({ image: 'hej' }, stream);
      expect(mocks.upload).toHaveBeenCalled();
    });
  });

  describe('.exists', () => {
    it('should call S3.headObject', async () => {
      mocks.headObject.mockClear();
      const storage = new S3Storage(defaultConfig);
      await storage.exists({ image: 'hej' });
      expect(mocks.headObject).toHaveBeenCalled();
    });
    
    it('should resolve to false if image does not exists', async () => {
      // In mock implementation of aws-sdk above headObject
      // is set to return false.
      const storage = new S3Storage(defaultConfig);
      const result = await storage.exists({ image: 'hej' });
      expect(result).toBe(false);
    });
  });
  
  describe('.stream', () => {
    it('should return a stream', async () => {
      const storage = new S3Storage(defaultConfig);
      const result = await storage.stream({ image: 'hej' });
      expect(result).toBeInstanceOf(Readable);
    });
  });

});

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
    getObject: jest.fn((params, cb) => {
      return {
        // Mock AWS events
        // If ContentType was provided when uploading the file
        // this mock will be true
        on: jest.fn((event, cb) => {
          cb(200, { 'content-type': 'image/jpeg' })
        }),
        createReadStream: jest.fn(() => {
          const { PassThrough } =  require('stream');
          return new PassThrough();
        })
      }
    }),
    upload: mocks.upload
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
describe('S3 storage', () => {
  describe('.upload', () => {
    let stream;
    beforeEach(() => {
      stream = createReadStream(join(assetsFolder, 'grid.jpg'));
    });

    it('should call S3.upload with correct parameters', async () => {
      mocks.upload.mockClear();
      const storage = new S3Storage(defaultConfig);
      await storage.upload({ image: 'hej' }, stream, 'image/jpeg');
      expect(mocks.upload).toHaveBeenCalledWith(
        expect.objectContaining({
          ContentType: 'image/jpeg'
        }),
        expect.anything()
      );
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
      expect(result.stream).toBeInstanceOf(Readable);
    });
    it('should return a contentType', async () => {
      const storage = new S3Storage(defaultConfig);
      const result = await storage.stream({ image: 'hej' });
      expect(result.contentType).toBe('image/jpeg');
    });
  });

});

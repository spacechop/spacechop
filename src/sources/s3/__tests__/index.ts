import AWS from 'aws-sdk';
import { createReadStream } from 'fs';
import { Readable } from 'stream';
import { S3SourceConfig } from '../types';
import S3Source from './../index';

const mocks = {
  headObject: jest.fn((params, cb) => { cb(null, false); }),
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
  })),
  config: { update: jest.fn() },
}));

const defaultConfig: S3SourceConfig = {
  access_key_id: 'xxx',
  secret_access_key: 'xxx',
  region: 'xxx',
  bucket_name: 'xx',
  path: ':image',
};
describe('S3 source', () => {
  describe('.exists', () => {
    it('should call S3.headObject', async () => {
      mocks.headObject.mockClear();
      const source = new S3Source(defaultConfig);
      // console.log(source);
      await source.exists({ image: 'hej' });
      expect(mocks.headObject).toHaveBeenCalled();
    });

    it('should resolve to false if image does not exists', async () => {
      // In mock implementation of aws-sdk above headObject
      // is set to return false.
      const source = new S3Source(defaultConfig);
      // console.log(source);
      const result = await source.exists({ image: 'hej' });
      expect(result).toBe(false);
    });
  });

  describe('.stream', () => {
    it('should return a stream', async () => {
      const source = new S3Source(defaultConfig);
      // console.log(source);
      const result = await source.stream({ image: 'hej' });
      expect(result).toBeInstanceOf(Readable);
    });
  });

});

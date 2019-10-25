import { Readable } from 'stream';
import Http from 'http';
import Https from 'https';
import { S3SourceConfig } from '../types';
import S3Source from './../index';

const mocks = {
  headObject: jest.fn((_, cb) => { cb(null, false); }),
  Endpoint: jest.fn(),
};

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(args => ({
    headObject: mocks.headObject,
    getObject: jest.fn(() => ({
      createReadStream: jest.fn(() => {
        const { PassThrough } = require('stream');
        return new PassThrough();
      }),
    })),
    config: args
  })),
  Endpoint: jest.fn().mockImplementation(
    (...args) => mocks.Endpoint(...args),
  ),
  config: { update: jest.fn() }
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
      await source.exists({ image: 'hej' });
      expect(mocks.headObject).toHaveBeenCalled();
    });

    it('should call AWS.Endpoint', async () => {
      mocks.headObject.mockClear();
      const source = new S3Source({
        ...defaultConfig,
        endpoint: 'endpoint',
      });
      await source.exists({ image: 'hej' });
      expect(mocks.Endpoint.mock.calls[0][0]).toBe('endpoint');
    });

    it('should resolve to false if image does not exists', async () => {
      // In mock implementation of aws-sdk above headObject
      // is set to return false.
      const source = new S3Source(defaultConfig);
      const result = await source.exists({ image: 'hej' });
      expect(result).toBe(false);
    });
  });

  describe('.key', () => {
    it('should return key', async () => {
      const source = new S3Source(defaultConfig);
      // console.log(source);
      const result = source.key({ image: 'hej' });
      expect(result).toMatch(/.+/);
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

  describe('.agent', () => {
    it('should utilize the http agent when ssl is disabled', async () => {
      const source = new S3Source({ ...defaultConfig, sslDisabled: true });
      expect(source.S3.config.httpOptions.agent.protocol).toBe('http:');
    });

    it('should utilize the https agent when ssl is enabled', async () => {
      const source = new S3Source({ ...defaultConfig });
      expect(source.S3.config.httpOptions.agent.protocol).toBe('https:');
    });
  });

});

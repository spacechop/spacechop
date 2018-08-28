import { S3StorageConfig } from "../types";
import S3Storage from "..";
import { createReadStream } from "fs";
import { join } from "path";
import assetsFolder from './../../../test/assets/dirname';

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    // simulates an faulty upload
    upload: jest.fn((params, cb) => {
      const error = new Error('Some error');
      cb(error);
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
      } catch(err) {
        errorThrown = err;
      }
      expect(errorThrown).toBeDefined();
    });
  });
});

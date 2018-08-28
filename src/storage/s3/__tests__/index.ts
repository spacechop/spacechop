import { S3StorageConfig } from "../types";
import S3Storage from "..";
import assetsFolder from './../../../test/assets/dirname';
import { createReadStream } from "fs";
import { join } from "path";

const mocks = {
  headObject: jest.fn((params, cb) => { cb(null, false); }),

  // mocking a successful upload
  upload: jest.fn((params, cb) => { cb(null, {})}),

};

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    headObject: mocks.headObject,
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
  endpoint: 'test.example.com'
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
  });
});

import S3StorageConfig from '../types';

describe('validate s3 storage', () => {
  it('should throw on invalid storage', () => {
    const config = {};
    expect(() => S3StorageConfig.check(config)).toThrowErrorMatchingSnapshot();
  });

  it('should throw on invalid params in source', () => {
    const config = {
      access_key_id: '',
      secret_access_key: '',
      region: '',
      bucket_name: '',
      path: ':image',
    };
    expect(() => S3StorageConfig.check(config)).toThrowErrorMatchingSnapshot();
  });

  it('should not throw on valid storage', () => {
    const config = {
      access_key_id: 'access_key_id',
      secret_access_key: 'secret_access_key',
      region: 'region',
      bucket_name: 'bucket_name',
      path: ':image',
    };
    expect(() => S3StorageConfig.check(config)).not.toThrow();
  });
});

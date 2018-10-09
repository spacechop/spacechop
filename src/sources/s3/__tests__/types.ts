import S3SourceConfig from '../types';

describe('validate s3 source', () => {
  it('should throw on invalid source', () => {
    const config = {};
    expect(() => S3SourceConfig.check(config)).toThrowErrorMatchingSnapshot();
  });

  it('should throw on invalid params in source', () => {
    const config = {
      access_key_id: '',
      secret_access_key: '',
      region: '',
      bucket_name: '',
      path: '',
    };
    expect(() => S3SourceConfig.check(config)).toThrowErrorMatchingSnapshot();
  });

  it('should throw on empty path in source', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [{ s3: {
        access_key_id: 'access_key_id',
        secret_access_key: 'secret_access_key',
        region: 'region',
        bucket_name: 'bucket_name',
        path: '',
      },
    }], presets: {} };
    expect(() => S3SourceConfig.check(config)).toThrowErrorMatchingSnapshot();
  });

  it('should not throw on valid source', () => {
    const config = {
      access_key_id: 'access_key_id',
      secret_access_key: 'secret_access_key',
      region: 'region',
      bucket_name: 'bucket_name',
      path: ':image',
    };
    expect(() => S3SourceConfig.check(config)).not.toThrow();
  });
});

import validate from '../..';

describe('validate s3 storage', () => {
  it('should throw on invalid storage', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [],
      storage: { s3: {} },
      presets: {},
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should throw on invalid params in source', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [],
      storage: { s3: {
        access_key_id: '',
        secret_access_key: '',
        region: '',
        bucket_name: '',
        path: ':image',
      } },
      presets: {},
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should not throw on valid storage', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [{
        s3: {
          access_key_id: 'access_key_id',
          secret_access_key: 'secret_access_key',
          region: 'region',
          bucket_name: 'bucket_name',
          path: ':image',
        },
      }],
      presets: {},
      storage: {
        s3: {
          access_key_id: 'access_key_id',
          secret_access_key: 'secret_access_key',
          region: 'region',
          bucket_name: 'bucket_name',
          path: ':image',
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
  });
});

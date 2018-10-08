import validate from '../..';

describe('validate s3 source', () => {
  it('should throw on invalid source', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [{ s3: {} }],
      presets: {},
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should throw on invalid params in source', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [{ s3: {
        access_key_id: '',
        secret_access_key: '',
        region: '',
        bucket_name: '',
        path: '',
      },
    }], presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
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
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should throw on missing params in source', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [{ s3: {
        access_key_id: 'access_key_id',
        secret_access_key: 'secret_access_key',
        region: 'region',
        bucket_name: 'bucket_name',
        path: 'images',
      },
    }], presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should throw on missing params in path on source', () => {
    const config = {
      paths: ['/:preset/:uuid'],
      sources: [{ s3: {
        access_key_id: 'access_key_id',
        secret_access_key: 'secret_access_key',
        region: 'region',
        bucket_name: 'bucket_name',
        path: 'images/:image',
      },
    }], presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should not throw on valid source', () => {
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
    };
    expect(() => validate(config)).not.toThrow();
  });
});

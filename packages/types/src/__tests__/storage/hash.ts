import { Config } from '../../types/Config';
import validate from '../../validate';

describe('validate hash', () => {
  it('should to throw error if hash parameter is not used in storage', () => {
    const config: Config = {
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
      storage: {
        s3: {
          access_key_id: 'access_key_id',
          secret_access_key: 'secret_access_key',
          region: 'region',
          bucket_name: 'bucket_name',
          path: ':image',
        },
      },
      presets: {},
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });
  it('should not throw error if hash parameter is used in storage', () => {
    const config: Config = {
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
      storage: {
        s3: {
          access_key_id: 'access_key_id',
          secret_access_key: 'secret_access_key',
          region: 'region',
          bucket_name: 'bucket_name',
          path: ':image.:hash',
        },
      },
      presets: {},
    };
    expect(() => validate(config)).not.toThrow();
  });
});

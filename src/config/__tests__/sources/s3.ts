import { validate } from '../../validate';
import * as t from 'runtypes';
import Config from '../../../types/Config';

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
    } }], presets: {} };
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
          path: '',
        },
      }],
      presets: {},
    };
    expect(() => validate(config)).not.toThrow();
  });
});

import HTTPSource from '../../http';
import S3Source from '../../s3';
import VolumeSource from '../../volume';
import instantiateSource from '../instantiate-source';

describe('instantiateSource', () => {
  it('should instantiate S3Source with all parameters', () => {
    const config = {
      access_key_id: 'xxx',
      bucket_name: 'yyy',
      path: '',
      secret_access_key: 'zzz',
      region: 'nyc3',
    };

    const instance = instantiateSource({
      s3: config,
    });

    expect(instance).toBeInstanceOf(S3Source);
    expect((instance as S3Source).config).toEqual(expect.objectContaining(config));
  });

  it('should instantiate HTTPSource with all parameters', () => {
    const config = {
      root: 'yyy',
    };

    const instance = instantiateSource({
      http: config,
    });

    expect(instance).toBeInstanceOf(HTTPSource);
    expect((instance as HTTPSource).config).toEqual(expect.objectContaining(config));
  });

  it('should instantiate VolumeSource with all parameters', () => {
    const config = {
      root: 'yyy',
    };

    const instance = instantiateSource({
      volume: config,
    });

    expect(instance).toBeInstanceOf(VolumeSource);
    expect((instance as VolumeSource).config).toEqual(expect.objectContaining(config));
  });
});

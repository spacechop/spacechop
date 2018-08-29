import instantiateSource from '../instantiate-source';
import S3Source from '../../s3';
import HTTPSource from '../../http';
import VolumeSource from '../../volume';

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
      s3: config
    });

    expect(instance).toBeInstanceOf(S3Source);
    expect((<S3Source>instance).config).toEqual(expect.objectContaining(config));
  });
  
  it('should instantiate HTTPSource with all parameters', () => {
    const config = {
      root: 'yyy'
    };

    const instance = instantiateSource({ 
      http: config
    });

    expect(instance).toBeInstanceOf(HTTPSource);
    expect((<HTTPSource>instance).config).toEqual(expect.objectContaining(config));
  });

  it('should instantiate VolumeSource with all parameters', () => {
    const config = {
      root: 'yyy'
    };

    const instance = instantiateSource({ 
      volume: config
    });

    expect(instance).toBeInstanceOf(VolumeSource);
    expect((<VolumeSource>instance).config).toEqual(expect.objectContaining(config));
  });
});

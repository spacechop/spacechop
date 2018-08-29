import instantiateStorage from './../instantiate-storage';
import S3Storage from '../../s3';

describe('instantiateStorage', () => {
  it('should instantiate S3Storage with all parameters', () => {
    const config = {
      access_key_id: 'xxx',
      bucket_name: 'yyy',
      path: '',
      secret_access_key: 'zzz',
      region: 'nyc3',
    };

    const instance = instantiateStorage({ 
      s3: config
    });

    expect(instance).toBeInstanceOf(S3Storage);
    expect((<S3Storage>instance).config).toEqual(expect.objectContaining(config));
  });
})

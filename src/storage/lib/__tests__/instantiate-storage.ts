import S3Storage from '../../s3';
import instantiateStorage from './../instantiate-storage';

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
      s3: config,
    });

    expect(instance).toBeInstanceOf(S3Storage);
    expect((instance as S3Storage).config).toEqual(expect.objectContaining(config));
  });
});

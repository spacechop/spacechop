import validate from '../../types/validate';

describe('validate params', () => {
  describe('storage', () => {
    it('should throw error on missing param in storage', () => {
      const config = {
        paths: ['/:preset/:uuid/:image'],
        sources: [{
          s3: {
            access_key_id: 'access_key_id',
            secret_access_key: 'secret_access_key',
            region: 'region',
            bucket_name: 'bucket_name',
            path: ':uuid',
          },
        }],
        storage: {
          s3: {
            access_key_id: 'access_key_id',
            secret_access_key: 'secret_access_key',
            region: 'region',
            bucket_name: 'bucket_name',
            path: '/:preset',
          },
        },
        presets: {},
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    });

    it('should throw error on missing param in path from storage', () => {
      const config = {
        paths: ['/:preset/:uuid'],
        sources: [{
          s3: {
            access_key_id: 'access_key_id',
            secret_access_key: 'secret_access_key',
            region: 'region',
            bucket_name: 'bucket_name',
            path: ':uuid',
          },
        }],
        storage: {
          s3: {
            access_key_id: 'access_key_id',
            secret_access_key: 'secret_access_key',
            region: 'region',
            bucket_name: 'bucket_name',
            path: '/:preset/:image',
          },
        },
        presets: {},
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    });

    it('should not throw error on valid storage', () => {
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
      expect(() => validate(config)).not.toThrow();
    });
  });

  describe('sources', () => {
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
  });

  describe('presets', () => {
    it('should throw on missing path params in config', () => {
      let config = {
        paths: ['/:preset/:width/:image'],
        sources: [{ volume: { root: '/src/app/test/assets/:image' } }],
        presets: {},
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
      config = {
        paths: ['/:preset/:width/:image'],
        sources: [{ volume: { root: '/src/app/test/assets/:image' } }],
        presets: { t_200: {
          steps: [{
            $resize: {
              width: 200,
              height: 200,
            },
          }],
        } },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
      config = {
        paths: ['/:preset/:width/:image'],
        sources: [{ volume: { root: '/src/app/test/assets/:image' } }],
        presets: { t_200: {
          steps: [{
            $resize: {
              width: 200,
              height: 200,
            },
          }],
        } },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
      config = {
        paths: ['/:preset/:width/:image'],
        sources: [{ volume: { root: '/src/app/test/assets' } }],
        presets: { t_200: {
          steps: [{
            $resize: {
              width: {
                from_path: 'width',
              },
              height: 200,
            },
          }],
        } },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
      config = {
        paths: ['/:preset/:width/:height/:image'],
        sources: [{ volume: { root: '/src/app/test/assets/:image' } }],
        presets: { t_200: {
          steps: [{
            $resize: {
              width: {
                from_path: 'width',
              },
              height: 200,
            },
          }],
        } },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
      config = {
        paths: ['/:preset/:image'],
        sources: [{ volume: { root: '/src/app/test/assets/:image' } }],
        presets: { t_200: {
          steps: [{
            $resize: {
              width: {
                from_path: 'width',
              },
              height: 200,
            },
          }],
        } },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
      config = {
        paths: ['/:preset'],
        sources: [{ volume: { root: '/src/app/test/assets/:image' } }],
        presets: { t_200: {
          steps: [{
            $resize: {
              width: 200,
              height: 200,
            },
          }],
        } },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    });

    it('should not throw on valid params in path', () => {
      const config = {
        paths: ['/:preset/:width/:height/:image'],
        sources: [{ volume: { root: '/src/app/test/assets/:image' } }],
        presets: { t_200: {
          steps: [{
            $resize: {
              width: {
                from_path: 'width',
              },
              height: {
                from_path: 'height',
              },
            },
          }],
        } },
      };
      expect(() => validate(config)).not.toThrow();
    });
  });
});

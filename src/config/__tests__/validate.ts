import { validate } from '../validate';

describe('should validate config.yml', () => {
  it('should require paths', () => {
    const config = {};
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid paths array', () => {
    let config = { paths: {}, sources: {}, presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = { paths: [], sources: {}, presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = { paths: [''], sources: {}, presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = { paths: ['/'], sources: {}, presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = { paths: ['/:image'], sources: {}, presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = { paths: [':preset'], sources: {}, presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = {
      paths: ['/:preset'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $crop: {
              width: 200,
              height: 200,
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $crop: {
              width: 200,
              height: 200,
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
  });

  it('should require sources', () => {
    const config = { paths: ['/:preset/:image'] };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid sources array', () => {
    const config = { paths: ['/:preset/:image'], sources: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid source', () => {
    const config = { paths: ['/:preset/:image'], sources: [{}] };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid source http', () => {
    const config = { paths: ['/:preset/:image'], sources: [{ http: {} }] };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid http root url', () => {
    const config = { paths: ['/:preset/:image'], sources: [{ http: { root: '' } }] };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid source s3', () => {
    let config = { paths: ['/:preset/:image'], sources: [{ s3: {} }], presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = { paths: ['/:preset/:image'], sources: [{ s3: {
      access_key_id: '',
      secret_access_key: '',
      region: '',
      bucket_name: '',
      path: '',
    } }], presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ s3: {
        access_key_id: 'access_key_id',
        secret_access_key: 'secret_access_key',
        region: 'region',
        bucket_name: 'bucket_name',
        path: '',
      } }],
      presets: {
        t_200: {
          steps: [{
            $crop: {
              width: 200,
              height: 200,
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
  });

  it('should throw on any other type of source', () => {
    const config = { paths: ['/:preset/:image'], sources: [{ bad_source: {} }] };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require presets', () => {
    const config = { paths: ['/:preset/:image'], sources: [{ http: { root: 'http://localhost' } }] };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid presets', () => {
    let config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {},
      },
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: {},
        },
      },
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{}],
        },
      },
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $crop: {},
          }],
        },
      },
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $crop: {
              width: 200,
              height: 200,
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $crop: {
              width: 200,
              height: 200,
              gravity: 'center',
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $crop: {
              width: 200,
              height: 200,
              gravity: 'left',
            },
          }],
        },
      },
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $crop: {
              width: 200,
              height: 200,
              gravity: 'face',
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $compress: {},
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $compress: {
              lossy: true,
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $compress: {
              quality: 0.9,
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $compress: {
              strip: true,
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $compress: {
              quality: 0.9,
              strip: true,
              lossy: true,
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $fill: {
              width: 200,
              height: 200,
              gravity: 'center',
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $fit: {
              width: 200,
              height: 200,
              gravity: 'northeast',
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
    config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $resize: {
              width: 200,
              height: 200,
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
  });
});

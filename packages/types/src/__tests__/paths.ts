import { Config } from '../types/Config';
import validate from '../validate';

describe('validate paths', () => {
  it('should require paths', () => {
    const config = {};
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should throw on invalid paths array', () => {
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
  });

  it('should throw on missing path params in config', () => {
    let config: Config = {
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
    const config: Config = {
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

  it('should not throw on non capture groups in path', () => {
    const config: Config = {
      paths: ['/:preset/:image([^.]+).(.*)'],
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
    expect(() => validate(config)).not.toThrow();
  });

  it('should not throw on valid config', () => {
    const defaultConfig = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost/:image' } }],
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
    expect(() => validate({ ...defaultConfig })).not.toThrow();
    expect(() => validate({
      ...defaultConfig,
      paths: ['/:preset/:image'],
    })).not.toThrow();
  });
});

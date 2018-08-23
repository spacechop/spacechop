import { validate } from '../validate';

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

  it('should not throw on valid config', () => {
    const defaultConfig = {
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
    expect(() => validate({ ...defaultConfig })).not.toThrow();
    expect(() => validate({
      ...defaultConfig,
      paths: ['/:preset/:image'],
    })).not.toThrow();
  });
});

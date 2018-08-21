import validate from '../validate';

jest.mock('../console');

describe('should validate config.yml', () => {
  it('should throw on invalid config', () => {
    let config = {};
    expect(() => validate(config, true)).toThrow();

    config = null;
    expect(() => validate(config, true)).toThrow();

    config = undefined;
    expect(() => validate(config, true)).toThrow();
  });

  it('should return false on invalid config', () => {
    const config = {};
    expect(validate(config)).toBe(false);
  });

  it('should now throw on valid config', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $crop: {
              width: 200,
            },
          }],
        },
      },
    };
    expect(() => validate(config, true)).not.toThrow();
  });
});

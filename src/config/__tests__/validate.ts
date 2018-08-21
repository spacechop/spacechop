import validate from '../validate';

describe('should validate config.yml', () => {
  it('should throw on invalid config', () => {
    let config = {};
    expect(() => validate(config, false)).toThrow();

    config = null;
    expect(() => validate(config, false)).toThrow();

    config = undefined;
    expect(() => validate(config, false)).toThrow();
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
    expect(() => validate(config, false)).not.toThrow();
  });
});

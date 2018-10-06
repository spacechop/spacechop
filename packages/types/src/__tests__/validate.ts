import validate from '../validate';

describe('should validate config.yml', () => {
  it('should throw on invalid config', () => {
    let config = {};
    expect(() => validate(config)).toThrow();

    config = null;
    expect(() => validate(config)).toThrow();

    config = undefined;
    expect(() => validate(config)).toThrow();
  });

  it('should not throw on valid config', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost/:image' } }],
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
    expect(() => validate(config)).not.toThrow();
  });
});

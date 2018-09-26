import { validate } from '../validate';

describe('validate presets', () => {
  it('should require presets', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should throw on invalid presets', () => {
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
          detect: ['face'],
          steps: [{}],
        },
      },
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });
});

import { validate } from '../../validate';

describe('validate http source', () => {
  it('should require valid source http', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [{ http: {} }],
      presets: {},
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid http root url', () => {
    const config = { paths: ['/:preset/:image'], sources: [{ http: { root: '' } }], presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });
});

import { validate } from '../../validate';

describe('validate sources', () => {
  it('should require sources', () => {
    const config = { paths: ['/:preset/:image'], presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid sources array', () => {
    const config = { paths: ['/:preset/:image'], sources: {}, presets: {} };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid source', () => {
    const config = { paths: ['/:preset/:image'], sources: [{}] };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });

  it('should throw on any other type of source', () => {
    const config = { paths: ['/:preset/:image'], sources: [{ bad_source: {} }] };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });
});

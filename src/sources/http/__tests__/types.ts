import HTTPSourceConfig from '../types';

describe('validate http source', () => {
  it('should require valid source http', () => {
    const config = {};
    expect(() => HTTPSourceConfig.check(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid http root url', () => {
    const config = { root: '' };
    expect(() => HTTPSourceConfig.check(config)).toThrowErrorMatchingSnapshot();
  });
});

import VolumeSourceConfig from '../types';

describe('validate volume source', () => {
  it('should require valid source http', () => {
    const config = {};
    expect(() => VolumeSourceConfig.check(config)).toThrowErrorMatchingSnapshot();
  });

  it('should require valid http root url', () => {
    const config = { root: '' };
    expect(() => VolumeSourceConfig.check(config)).toThrowErrorMatchingSnapshot();
  });
});

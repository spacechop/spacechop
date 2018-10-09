import CompressConfig from '../types';

describe('should validate compress config', () => {
  describe('should throw on invalid config', () => {
    it('require quality as non decimal number', () => {
      const config = {
        quality: 0.9,
        lossy: true,
      };
      expect(() => CompressConfig.check(config)).toThrowErrorMatchingSnapshot();
    });

    it('require quality between 0-100', () => {
      const config = {
        quality: -1,
        lossy: true,
      };
      expect(() => CompressConfig.check(config)).toThrowErrorMatchingSnapshot();
    });
  });

  it('should now throw on valid config', () => {
    const config = {
      quality: 90,
      lossy: true,
    };
    expect(() => CompressConfig.check(config)).not.toThrow();
  });
});

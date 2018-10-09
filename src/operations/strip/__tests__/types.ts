import StripConfig, { StripConfig as Config } from '../types';

describe('should validate strip config', () => {
  describe('should throw on invalid config', () => {
    it('require valid icc_profile', () => {
      const config = {
        icc_profile: 'icc_profile',
      };
      expect(() => StripConfig.check(config)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('should now throw on valid config', () => {
    it(`valid icc_profile`, () => {
      const config: Config = {
        icc_profile: true,
      };
      expect(() => StripConfig.check(config)).not.toThrow();
    });
  });
});

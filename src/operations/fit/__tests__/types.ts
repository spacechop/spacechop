import FitConfig, { FitConfig as Config } from '../types';

describe('should validate fit config', () => {
  describe('should throw on invalid config', () => {
    it('require width or height', () => {
      const config = {};
      expect(() => FitConfig.check(config)).toThrowErrorMatchingSnapshot();
    });

    it('require valid width and height', () => {
      let config: Config = {
        width: -100,
        height: 100,
      };
      expect(() => FitConfig.check(config)).toThrowErrorMatchingSnapshot();

      config = {
        width: 100,
        height: -100,
      };
      expect(() => FitConfig.check(config)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('should now throw on valid config', () => {
    it('width & height', () => {
      const config: Config = {
        width: 100,
        height: 100,
      };
      expect(() => FitConfig.check(config)).not.toThrow();
    });
  });
});

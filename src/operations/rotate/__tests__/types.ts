import RotateConfig, { RotateConfig as Config } from '../types';

describe('should validate rotate config', () => {
  describe('should throw on invalid config', () => {
    it('require angle', () => {
      const config = {};
      expect(() => RotateConfig.check(config)).toThrowErrorMatchingSnapshot();
    });

    it('require valid width and height', () => {
      let config: Config = {
        angle: -361,
      };
      expect(() => RotateConfig.check(config)).toThrowErrorMatchingSnapshot();

      config = {
        angle: 361,
      };
      expect(() => RotateConfig.check(config)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('should now throw on valid config', () => {
    it('width & height', () => {
      let config: Config = {
        angle: 90,
      };
      expect(() => RotateConfig.check(config)).not.toThrow();

      config = {
        angle: 'auto',
      };
      expect(() => RotateConfig.check(config)).not.toThrow();
    });
  });
});

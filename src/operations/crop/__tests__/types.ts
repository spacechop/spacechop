import CropConfig, { CropConfig as Config } from '../types';

describe('should validate crop config', () => {
  describe('should throw on invalid config', () => {
    it('require width or height', () => {
      const config: Config = {};
      expect(() => CropConfig.check(config)).toThrowErrorMatchingSnapshot();
    });

    it('require valid width and height', () => {
      let config: Config = {
        width: -100,
      };
      expect(() => CropConfig.check(config)).toThrowErrorMatchingSnapshot();

      config = {
        height: -100,
      };
      expect(() => CropConfig.check(config)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('should now throw on valid config', () => {
    it('width & height', () => {
      const config: Config = {
        width: 100,
        height: 100,
      };
      expect(() => CropConfig.check(config)).not.toThrow();
    });

    it('width only', () => {
      const config: Config = {
        width: 100,
      };
      expect(() => CropConfig.check(config)).not.toThrow();
    });

    it('height only', () => {
      const config: Config = {
        width: 100,
      };
      expect(() => CropConfig.check(config)).not.toThrow();
    });

    it('width & height & gravity', () => {
      const config: Config = {
        width: 100,
        height: 100,
        gravity: 'center',
      };
      expect(() => CropConfig.check(config)).not.toThrow();
    });
  });
});

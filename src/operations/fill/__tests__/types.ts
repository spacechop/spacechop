import FillConfig, { FillConfig as Config } from '../types';

describe('should validate fill config', () => {
  describe('should throw on invalid config', () => {
    it('require width or height', () => {
      const config = {};
      expect(() => FillConfig.check(config)).toThrowErrorMatchingSnapshot();
    });

    it('require valid width and height', () => {
      let config: Config = {
        width: -100,
        height: 100,
      };
      expect(() => FillConfig.check(config)).toThrowErrorMatchingSnapshot();

      config = {
        width: 100,
        height: -100,
      };
      expect(() => FillConfig.check(config)).toThrowErrorMatchingSnapshot();
    });

    it('require valid gravity', () => {
      const config = {
        width: 100,
        height: 100,
        gravity: 'right',
      };
      expect(() => FillConfig.check(config)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('should now throw on valid config', () => {
    it('width & height', () => {
      const config: Config = {
        width: 100,
        height: 100,
      };
      expect(() => FillConfig.check(config)).not.toThrow();
    });

    it('width & height & gravity', () => {
      const config: Config = {
        width: 100,
        height: 100,
        gravity: 'center',
      };
      expect(() => FillConfig.check(config)).not.toThrow();
    });
  });
});

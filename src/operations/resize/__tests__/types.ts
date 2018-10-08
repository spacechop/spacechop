import ResizeConfig, { ResizeConfig as Config } from '../types';

describe('should validate resize config', () => {
  describe('should throw on invalid config', () => {
    it('require width or height', () => {
      const config = {};
      expect(() => ResizeConfig.check(config)).toThrowErrorMatchingSnapshot();
    });

    it('require valid width and height', () => {
      let config = {
        width: -100,
        height: 100,
      };
      expect(() => ResizeConfig.check(config)).toThrowErrorMatchingSnapshot();

      config = {
        width: 100,
        height: -100,
      };
      expect(() => ResizeConfig.check(config)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('should now throw on valid config', () => {
    it('width & height', () => {
      const config: Config = {
        width: 100,
        height: 100,
      };
      expect(() => ResizeConfig.check(config)).not.toThrow();
    });
  });
});

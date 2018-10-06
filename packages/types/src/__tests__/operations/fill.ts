import { defaultConfig } from '.';
import { Config } from '../../types/Config';
import validate from '../../validate';

describe('should validate fill config', () => {
  describe('should throw on invalid config', () => {
    it('require width or height', () => {
      const config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $fill: {
              },
            }],
          },
        },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    });

    it('require valid width and height', () => {
      let config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $fill: {
                width: -100,
                height: 100,
              },
            }],
          },
        },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();

      config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $fill: {
                width: 100,
                height: -100,
              },
            }],
          },
        },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    });

    it('require valid gravity', () => {
      const config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $fill: {
                width: 100,
                height: 100,
                gravity: 'right',
              },
            }],
          },
        },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('should now throw on valid config', () => {
    it('width & height', () => {
      const config: Config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $fill: {
                width: 100,
                height: 100,
              },
            }],
          },
        },
      };
      expect(() => validate(config)).not.toThrow();
    });

    it('width & height & gravity', () => {
      const config: Config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $fill: {
                width: 100,
                height: 100,
                gravity: 'center',
              },
            }],
          },
        },
      };
      expect(() => validate(config)).not.toThrow();
    });
  });
});

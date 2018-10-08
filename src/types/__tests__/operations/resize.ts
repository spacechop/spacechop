import { defaultConfig } from '.';
import validate from '../..';
import { Config } from '../../Config';

describe('should validate resize config', () => {
  describe('should throw on invalid config', () => {
    it('require width or height', () => {
      const config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $resize: {
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
              $resize: {
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
              $resize: {
                width: 100,
                height: -100,
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
              $resize: {
                width: 100,
                height: 100,
              },
            }],
          },
        },
      };
      expect(() => validate(config)).not.toThrow();
    });
  });
});

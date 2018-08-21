import { defaultConfig } from '.';
import { Config } from '../../../types/Config';
import { validate } from '../../validate';

describe('should validate compress config', () => {
  describe('should throw on invalid config', () => {
    it('require quality as non decimal number', () => {
      const config: Config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $compress: {
                quality: 0.9,
                lossy: true,
              },
            }],
          },
        },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    });

    it('require quality between 0-100', () => {
      const config: Config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $compress: {
                quality: -1,
                lossy: true,
              },
            }],
          },
        },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    });
  });

  it('should now throw on valid config', () => {
    const config: Config = {
      ...defaultConfig,
      presets: {
        t_200: {
          steps: [{
            $compress: {
              quality: 90,
              lossy: true,
            },
          }],
        },
      },
    };
    expect(() => validate(config)).not.toThrow();
  });
});

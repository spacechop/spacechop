import { defaultConfig } from '.';
import { Config } from '../../types/Config';
import validate from '../../validate';

describe('should validate strip config', () => {
  describe('should throw on invalid config', () => {
    it('require valid icc_profile', () => {
      const config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $strip: {
                icc_profile: 'icc_profile',
              },
            }],
          },
        },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('should now throw on valid config', () => {
    it(`valid icc_profile`, () => {
      const config: Config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $strip: {
                icc_profile: true,
              },
            }],
          },
        },
      };
      expect(() => validate(config)).not.toThrow();
    });
  });
});

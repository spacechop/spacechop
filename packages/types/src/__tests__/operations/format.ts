import { defaultConfig } from '.';
import { Config } from '../../types/Config';
import { allFormats } from '../../types/Format';
import validate from '../../validate';

describe('should validate format config', () => {
  describe('should throw on invalid config', () => {
    it('require type', () => {
      const config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $format: {
              },
            }],
          },
        },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    });

    it('require valid format type', () => {
      const config = {
        ...defaultConfig,
        presets: {
          t_200: {
            steps: [{
              $format: {
                type: 'type',
              },
            }],
          },
        },
      };
      expect(() => validate(config)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('should now throw on valid config', () => {
    for (const type of allFormats) {
      it(`valid ${type}`, () => {
        const config: Config = {
          ...defaultConfig,
          presets: {
            t_200: {
              steps: [{
                $format: {
                  type,
                },
              }],
            },
          },
        };
        expect(() => validate(config)).not.toThrow();
      });
    }
  });
});

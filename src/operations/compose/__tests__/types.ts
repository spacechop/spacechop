import { allFormats } from '../../../types/Format';
import FormatConfig, { FormatConfig as Config } from '../types';

describe('should validate format config', () => {
  describe('should throw on invalid config', () => {
    it('require type', () => {
      const config = {};
      expect(() => FormatConfig.check(config)).toThrowErrorMatchingSnapshot();
    });

    it('require valid format type', () => {
      const config = {
        type: 'type',
      };
      expect(() => FormatConfig.check(config)).toThrowErrorMatchingSnapshot();
    });
  });

  describe('should now throw on valid config', () => {
    for (const type of allFormats) {
      it(`valid ${type}`, () => {
        const config: Config = {
          type,
        };
        expect(() => FormatConfig.check(config)).not.toThrow();
      });
    }
  });
});

import Presets from '../Presets';

describe('validate Presets', () => {
  describe('invalid', () => {
    it('should require presets', () => {
      const presets = null;
      expect(() => Presets.check(presets)).toThrowErrorMatchingSnapshot();
    });

    it('should throw on invalid presets', () => {
      let presets = {
        t_200: {},
      };
      expect(() => Presets.check(presets)).toThrowErrorMatchingSnapshot();

      presets = {
        t_200: {
          steps: {},
        },
      };
      expect(() => Presets.check(presets)).toThrowErrorMatchingSnapshot();

      presets = {
        t_200: {
          steps: [{}],
        },
      };
      expect(() => Presets.check(presets)).toThrowErrorMatchingSnapshot();
    });
  });
});

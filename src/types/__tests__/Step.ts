import Step from '../Step';

describe('validate Step', () => {
  describe('invalid', () => {
    it('no double operations in step', () => {
      const config = {
        $crop: {
          width: 100,
          height: 100,
        },
        $resize: {
          width: 100,
          height: 100,
        },
      };
      expect(() => Step.check(config)).toThrowErrorMatchingSnapshot();
    });
  });
});

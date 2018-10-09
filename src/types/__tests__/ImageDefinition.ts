import ImageDefinition from '../ImageDefinition';

describe('validate ImageDefinition', () => {
  describe('invalid', () => {
    it('no empty config', () => {
      const config = {};
      expect(() => ImageDefinition.check(config)).toThrowErrorMatchingSnapshot();
    });

    it('faulty width', () => {
      const config = {
        width: -1,
        heigth: 100,
        type: 'jpeg',
      };
      expect(() => ImageDefinition.check(config)).toThrowErrorMatchingSnapshot();
    });

    it('faulty height', () => {
      const config = {
        width: 100,
        heigth: -1,
        type: 'jpeg',
      };
      expect(() => ImageDefinition.check(config)).toThrowErrorMatchingSnapshot();
    });

    it('faulty type', () => {
      const config = {
        width: 100,
        heigth: 100,
        type: 'jpg',
      };
      expect(() => ImageDefinition.check(config)).toThrowErrorMatchingSnapshot();
    });
  });
});

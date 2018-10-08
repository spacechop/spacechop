import ImageFaceBox from '../ImageFaceBox';

describe('validate ImageFaceBox', () => {
  describe('invalid', () => {
    it('no empty config', () => {
      const config = {};
      expect(() => ImageFaceBox.check(config)).toThrowErrorMatchingSnapshot();
    });
  });
});

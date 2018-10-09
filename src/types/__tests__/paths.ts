import Paths from '../Paths';

describe('validate Paths', () => {
  describe('invalid', () => {
    it('should require paths', () => {
      const paths = null;
      expect(() => Paths.check(paths)).toThrowErrorMatchingSnapshot();
    });

    it('should throw on invalid paths array', () => {
      let paths = {};
      expect(() => Paths.check(paths)).toThrowErrorMatchingSnapshot();
      paths = [];
      expect(() => Paths.check(paths)).toThrowErrorMatchingSnapshot();
      paths = [''];
      expect(() => Paths.check(paths)).toThrowErrorMatchingSnapshot();
      paths = ['/'];
      expect(() => Paths.check(paths)).toThrowErrorMatchingSnapshot();
      paths = ['/:image'];
      expect(() => Paths.check(paths)).toThrowErrorMatchingSnapshot();
      paths = [':preset'];
      expect(() => Paths.check(paths)).toThrowErrorMatchingSnapshot();
    });

    it('should not throw on non capture groups in path', () => {
      const paths = ['/:preset/:image([^.]+).(.*)'];
      expect(() => Paths.check(paths)).not.toThrow();
    });
  });
});

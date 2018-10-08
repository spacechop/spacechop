import Sources from '../Sources';

describe('validate Sources', () => {
  describe('invalid', () => {
    it('should require sources', () => {
      const sources = null;
      expect(() => Sources.check(sources)).toThrowErrorMatchingSnapshot();
    });

    it('should require valid sources array', () => {
      const sources = {};
      expect(() => Sources.check(sources)).toThrowErrorMatchingSnapshot();
    });

    it('should require valid source', () => {
      const sources = [{}];
      expect(() => Sources.check(sources)).toThrowErrorMatchingSnapshot();
    });

    it('should throw on any other type of source', () => {
      const sources = [{ bad_source: {} }];
      expect(() => Sources.check(sources)).toThrowErrorMatchingSnapshot();
    });
  });
});

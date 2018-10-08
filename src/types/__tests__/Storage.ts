import Storage from '../Storage';

describe('validate Storage', () => {
  describe('invalid', () => {
    it('should require valid storage array', () => {
      const storage = {};
      expect(() => Storage.check(storage)).toThrowErrorMatchingSnapshot();
    });

    it('should require valid storage', () => {
      const storage = [{}];
      expect(() => Storage.check(storage)).toThrowErrorMatchingSnapshot();
    });

    it('should throw on any other type of storage', () => {
      const storage = [{ bad_storage: {} }];
      expect(() => Storage.check(storage)).toThrowErrorMatchingSnapshot();
    });
  });
});

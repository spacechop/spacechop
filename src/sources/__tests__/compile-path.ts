import compile from '../compile-path';

describe('Compile path', () => {
  describe('failes', () => {
    it('no pattern', () => {
      const pattern = null;
      const params = {};
      expect(() => compile(pattern, params)).toThrow();
    });
  });

  describe('succeeds', () => {
    const pattern = '/:preset/:image';
    const params = { preset: 't_200', image: 'cat.jpg' };
    expect(compile(pattern, params)).toMatchSnapshot();
  });
});

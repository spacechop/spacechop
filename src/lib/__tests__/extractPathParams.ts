import extract from '../extractPathParams';

describe('Extract path params', () => {
  describe('failes', () => {
    it('no pattern', () => {
      const pattern = null;
      expect(() => extract(pattern)).toThrow();
    });
  });

  describe('succeeds', () => {
    const pattern = '/:preset/:image';
    const params = [{ name: 'preset'}, { name: 'image' }];
    expect(extract(pattern)[0]).toEqual(expect.objectContaining(params[0]));
    expect(extract(pattern)[1]).toEqual(expect.objectContaining(params[1]));
  });
});

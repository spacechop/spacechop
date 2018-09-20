import extract from '../extractPathParams';

describe('Extract path params', () => {
  describe('failes', () => {
    it('no pattern', () => {
      const pattern = null;
      expect(() => extract(pattern)).toThrow();
    });
  });

  it('does not extract non capture groups (numerically indexed groups)', () => {
    const pattern = '/:preset/:image([^.]+).(.*)';
    const params = [{ name: 'preset'}, { name: 'image' }];
    expect(extract(pattern)[0]).toEqual(expect.objectContaining(params[0]));
    expect(extract(pattern)[1]).toEqual(expect.objectContaining(params[1]));
  });

  it('succeeds', () => {
    const pattern = '/:preset/:image';
    const params = [{ name: 'preset'}, { name: 'image' }];
    expect(extract(pattern)[0]).toEqual(expect.objectContaining(params[0]));
    expect(extract(pattern)[1]).toEqual(expect.objectContaining(params[1]));
  });
});

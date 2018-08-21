import { buildUri } from '..';

describe('HTTP Source', () => {
  describe('buildUri', () => {
    const paths = [
      'http://spacechop.com/:preset/:image',
      'http://localhost:8080/:preset/:image',
    ];

    const params = {
      preset: 't_720',
      image: 'test.jpg',
    };

    const expected = [
      'http://spacechop.com/t_720/test.jpg',
      'http://localhost:8080/t_720/test.jpg',
    ];

    for (let i in paths) {
      const path = paths[i];
      it(`should work with path: ${path}`, () => {
        expect(buildUri(path, params)).toBe(expected[i]);
      });
    }
  });
});

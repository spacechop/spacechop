import { Config } from '../../../types/Config';
import { validate } from '../../validate';

export const defaultConfig: Config = {
  paths: ['/:preset/:image'],
  sources: [{ http: { root: 'http://localhost/:image' }}],
  presets: {},
};

describe('should validate operations', () => {
  it('no double operations in step', () => {
    const config = {
      paths: ['/:preset/:image'],
      sources: [{ http: { root: 'http://localhost' } }],
      presets: {
        t_200: {
          steps: [{
            $crop: {
              width: 100,
              height: 100,
            },
            $resize: {
              width: 100,
              height: 100,
            },
          }],
        },
      },
    };
    expect(() => validate(config)).toThrowErrorMatchingSnapshot();
  });
});

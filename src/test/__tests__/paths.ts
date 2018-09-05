import { Express } from 'jest-express/lib/express';
import path from 'path';
import pathToRegex from 'path-to-regexp';
import { Config } from '../../types/Config';
import setupPaths from './../../spacechop';
import assetsFolder from './../assets/dirname';

/**
 * Tests in this file use the full spacechop implementation by mocking Express
 * Response and Requests.
 */
describe('Setup paths', () => {
  describe('empty config', () => {
    const config = null;

    const app = new Express();
    app.get = jest.fn();

    it('should not setup path', () => {
      expect(setupPaths(config, app)).toBe(undefined);
    });
  });

  describe('invalid config', () => {
    const config: Config = {
      sources: [],
      paths: [],
      presets: {},
    };

    const app = new Express();
    app.get = jest.fn();

    it('should not setup path', () => {
      expect(setupPaths(config, app)).toBe(undefined);
    });
  });

  describe('valid config', () => {
    const p = '/:preset/:image';
    const config: Config = {
      sources: [{
        volume: {
          root: path.join(assetsFolder, ':image'),
        },
      }],
      paths: [p],
      presets: {
        t_original: {
          steps: [],
        },
      },
    };

    const app = new Express();
    app.get = jest.fn();

    it('should setup path', () => {
      setupPaths(config, app);
      const ps = pathToRegex(p);
      expect(app.get.mock.calls[0][0].toString()).toBe(ps.toString());
    });
  });
});

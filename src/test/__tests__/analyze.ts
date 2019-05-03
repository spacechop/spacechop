import { createReadStream } from 'fs';
import path from 'path';
import extractPathParams from '../../lib/extractPathParams';
import instantiateSource from '../../sources/lib/instantiate-source';
import { Config } from '../../types/Config';
import { formatToMime } from '../../types/Format';
import { requestHandler } from './../../spacechop';
import assetsFolder from './../assets/dirname';
import { Request, Response } from './../utils/expressMocks';

/**
 * Tests in this file use the full spacechop implementation by mocking Express
 * Response and Requests.
 */
describe('Headers', () => {
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

  const sources = config.sources.map(instantiateSource);

  const params = extractPathParams(p);

  describe('Content-Type', () => {

    let request;
    let response;
    beforeEach(() => {
      request = new Request();
      response = new Response();
    });

    // asset filename => asset content-type
    const tests: { [key: string]: any } = {
      'grid.jpg': { type: 'jpeg', width: 100, height: 100 },
      'grid.png': { type: 'png', width: 100, height: 100 },
      'grid.gif': { type: 'gif', width: 100, height: 100 },
      'grid.webp': { type: 'webp', width: 100, height: 100 },
      'grid-interlaced.png': { type: 'png', width: 100, height: 100 },
      'grid-no-exif.jpg': { type: 'jpeg', width: 100, height: 100 },
      'animated.gif': { type: 'gif', width: 100, height: 100 },
      'animated.png': { type: 'png', width: 100, height: 100},
      'file.svg': { type: 'svg', width: 200, height: 200 },
      'file-nodoctype.svg': { type: 'svg', width: 120, height: 80 }
    };

    for (const asset of Object.keys(tests)) {
      const expected = tests[asset];

      const handler = requestHandler(config, params, sources);
      it(`should correctly analyze asset [${asset}] when fetched from source`, async () => {
        request.setParams(0, 't_original');
        request.setParams(1, asset);
        request.setQuery('analyze');
        await handler(request, response);
        expect(response.json).toBeCalledWith(
          expect.objectContaining(expected),
        );
      });

      const storage = {
        exists: jest.fn(() => Promise.resolve(true)),
        stream: jest.fn(() => Promise.resolve({
          stream: createReadStream(path.join(assetsFolder, asset)),
          contentType: formatToMime(expected.type),
        })),
        upload: jest.fn(),
      };
      const storageHandler = requestHandler(config, params, sources, storage);
      it(`should correctly analyze asset [${asset}] when fetched from storage`, async () => {
        request.setParams(0, 't_original');
        request.setParams(1, asset);
        request.setQuery('analyze');
        await storageHandler(request, response);
        expect(response.json).toBeCalledWith(
          expect.objectContaining(expected),
        );
      });

      const missingStorage = {
        exists: jest.fn(() => Promise.resolve(false)),
        stream: jest.fn(() => Promise.resolve(null)),
        upload: jest.fn(),
      };
      const missingStorageHandler = requestHandler(config, params, sources, missingStorage);
      it(`should correctly analyze asset [${asset}] when not existing in storage`, async () => {
        request.setParams(0, 't_original');
        request.setParams(1, asset);
        request.setQuery('analyze');
        await missingStorageHandler(request, response);
        expect(response.json).toBeCalledWith(
          expect.objectContaining(expected),
        );
      });
    }
  });
});

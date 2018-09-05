import path from 'path';
import extractPathParams from '../../lib/extractPathParams';
import instantiateSource from '../../sources/lib/instantiate-source';
import { Config } from '../../types/Config';
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
  const handler = requestHandler(config, params, sources);

  describe('Content-Type', () => {

    let request;
    let response;
    beforeEach(() => {
      request = new Request();
      response = new Response();
    });

    // asset filename => asset content-type
    const tests: { [key: string]: any } = {
      'grid.jpg': 'jpeg',
      'grid.png': 'png',
      'grid.gif': 'gif',
      'grid.webp': 'webp',
      'grid-interlaced.png': 'png',
      'grid-no-exif.jpg': 'jpeg',
      'animated.gif': 'gif',
      'animated.png': 'png',
    };

    for (const asset of Object.keys(tests)) {
      const contentType = tests[asset];
      it(`should set contentType = ${contentType} for asset ${asset}`, async () => {
        request.setParams(0, 't_original');
        request.setParams(1, asset);
        request.setQuery('analyze');
        await handler(request, response);
        expect(response.json).toBeCalledWith(
          expect.objectContaining({
            type: contentType,
          }),
        );
      });
    }
  });
});

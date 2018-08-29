import { requestHandler } from './../../spacechop';
import { Config } from '../../types/Config';
import assetsFolder from './../assets/dirname';
import path from 'path';
import pathToRegex from 'path-to-regexp';
import { Request, Response } from './../utils/expressMocks';
import { Mime } from '../../types/Format';
import instantiateSource from '../../sources/lib/instantiate-source';

/**
 * Tests in this file use the full spacechop implementation by mocking Express 
 * Response and Requests.
 */
describe('Headers', () => {
  const p = '/:preset/:image'
  const config: Config = {
    sources: [{
      volume: {
        root: path.join(assetsFolder, ':image')
      }
    }],
    paths: [p],
    presets: {
      t_original: {
        steps: []
      }
    }
  };

  const sources = config.sources.map(instantiateSource);

  const keys = [];
  // populates `keys` array
  pathToRegex(p, keys);
  const handler = requestHandler(config, keys, sources)

  describe('Content-Type', () => {

    let request;
    let response;
    beforeEach(() => {
      request = new Request();
      response = new Response();
    })

    // asset filename => asset content-type
    const tests: { [key: string] : Mime} = {
      'grid.jpg': 'image/jpeg',
      'grid.png': 'image/png',
      'grid.gif': 'image/gif',
      'grid.webp': 'image/webp',
      'grid-interlaced.png': 'image/png',
      'grid-no-exif.jpg': 'image/jpeg',
      'animated.gif': 'image/gif',
      'animated.png': 'image/png'
    };
    
    for (const asset of Object.keys(tests)) {
      const contentType = tests[asset];
      it(`should set contentType = ${contentType} for asset ${asset}`, async () => {
        request.setParams(0, 't_original');
        request.setParams(1, asset);
        await handler(request, response);
        expect(response.set).toBeCalledWith('Content-Type', contentType);
      })
    }
  })
})

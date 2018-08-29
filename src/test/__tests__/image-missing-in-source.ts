import { requestHandler } from './../../spacechop';
import { Config } from '../../types/Config';
import assetsFolder from './../assets/dirname';
import path from 'path';
import pathToRegex from 'path-to-regexp';
import { Request, Response } from './../utils/expressMocks';
import { PassThrough } from 'stream';

/**
 * Tests in this file use the full spacechop implementation by mocking Express 
 * Response and Requests.
 */
describe('Image missing in source', () => {
  
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

  const sources = [
    {
      exists: jest.fn(() => Promise.resolve(false)),
      stream: jest.fn(),
    }
  ];

  const keys = [];
  // populates `keys` array
  pathToRegex(p, keys);
  const handler = requestHandler(config, keys, sources);

  let request;
  let response;
  beforeAll(async () => {
    request = new Request();
    response = new Response();
    request.setParams(0, 't_something');
    request.setParams(1, 'grid.png');
    await handler(request, response);
  })
  it('should set status 404', () => {
    expect(response.status).toBeCalledWith(404);
  });
})

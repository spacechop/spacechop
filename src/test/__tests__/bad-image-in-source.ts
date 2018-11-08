import path from 'path';
import extractPathParams from '../../lib/extractPathParams';
import { Config } from '../../types/Config';
import { requestHandler } from './../../spacechop';
import assetsFolder from './../assets/dirname';
import { Request, Response } from './../utils/expressMocks';

/**
 * Tests in this file use the full spacechop implementation by mocking Express
 * Response and Requests.
 */
describe('Bad image in source', () => {
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

  const sources = [
    {
      key: jest.fn(),
      exists: jest.fn(() => Promise.resolve(true)),
      stream: jest.fn(() => Promise.reject()),
    },
  ];

  const params = extractPathParams(p);
  const handler = requestHandler(config, params, sources);

  let request;
  let response;
  beforeAll(async () => {
    request = new Request();
    response = new Response();
    request.setParams(0, 't_original');
    request.setParams(1, 'zero-byte-file');
    await handler(request, response);
  });
  it('should set status 400', () => {
    expect(response.status).toBeCalledWith(400);
    expect(response.end.mock.calls[0]).toMatchSnapshot();
  });
});

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
describe('Image missing in source', () => {
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
      exists: jest.fn(() => Promise.resolve(false)),
      stream: jest.fn(),
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
    request.setParams(1, 'grid.png');
    await handler(request, response);
  });
  it('should set status 404', () => {
    expect(response.status).toBeCalledWith(404);
    expect(response.end.mock.calls[0]).toMatchSnapshot();
  });
});

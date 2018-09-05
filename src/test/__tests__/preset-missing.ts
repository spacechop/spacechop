import path from 'path';
import { PassThrough } from 'stream';
import extractPathParams from '../../lib/extractPathParams';
import { Config } from '../../types/Config';
import { requestHandler } from './../../spacechop';
import assetsFolder from './../assets/dirname';
import { Request, Response } from './../utils/expressMocks';

/**
 * Tests in this file use the full spacechop implementation by mocking Express
 * Response and Requests.
 */
describe('Preset missing', () => {
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
    storage: {
      s3: {
        access_key_id: 'xxx',
        bucket_name: 'yy',
        path: '',
        region: 'nyc2',
        secret_access_key: 'zz',
      },
    },
  };

  const sources = [
    {
      exists: jest.fn(),
      stream: jest.fn(),
    },
  ];
  const mockedStorageResponse = { stream: new PassThrough(), contentType: 'image/jpeg' };
  const storage = {
    exists: jest.fn(() => Promise.resolve(true)),
    stream: jest.fn(() => Promise.resolve(mockedStorageResponse)),
    upload: jest.fn(),
  };

  const params = extractPathParams(p);
  const handler = requestHandler(config, params, sources, storage);

  let request;
  let response;
  beforeAll(async () => {
    request = new Request();
    response = new Response();
    request.setParams(0, 't_something');
    request.setParams(1, 'grid.png');
    await handler(request, response);
  });
  it('should set status 404', () => {
    expect(response.status).toBeCalledWith(404);
    expect(response.end.mock.calls[0]).toMatchSnapshot();
  });
});

import { createReadStream } from 'fs';
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
describe('Configured storage', () => {
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
  describe('Image exists in storage cache', () => {
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
      request.setParams(0, 't_original');
      request.setParams(1, 'grid.png');
      await handler(request, response);
    });
    it('should check storage', () => {
      expect(storage.exists).toHaveBeenCalled();
      expect(storage.stream).toHaveBeenCalled();
    });
    it('should not check source', () => {
      expect(sources[0].exists).not.toHaveBeenCalled();
      expect(sources[0].stream).not.toHaveBeenCalled();
    });
    it('should set content type as returned from storage', () => {
      expect(response.set).toBeCalledWith('Content-Type', mockedStorageResponse.contentType);
    });
    it('should not call storage .upload', () => {
      expect(storage.upload).not.toHaveBeenCalled();
    });
  });


  describe('Image does not exists in storage cache', () => {
    const image = path.join(assetsFolder, 'grid.png');

    const sources = [
      {
        exists: jest.fn(() => Promise.resolve(true)),
        stream: jest.fn(() => Promise.resolve(createReadStream(image))),
      },
    ];
    const storage = {
      exists: jest.fn(() => Promise.resolve(false)),
      stream: jest.fn(),
      upload: jest.fn(),
    };

    const params = extractPathParams(p);
    const handler = requestHandler(config, params, sources, storage);

    let request;
    let response;
    beforeAll(async () => {
      request = new Request();
      response = new Response();
      request.setParams(0, 't_original');
      request.setParams(1, 'grid.png');
      await handler(request, response);
    });
    it('should check storage', () => {
      expect(storage.exists).toHaveBeenCalled();
    });
    it('should check source', () => {
      expect(sources[0].exists).toHaveBeenCalled();
      expect(sources[0].stream).toHaveBeenCalled();
    });
    it('should call storage .upload', () => {
      expect(storage.upload).toHaveBeenCalled();
    });
  });
});

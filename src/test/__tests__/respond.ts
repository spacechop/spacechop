import path from 'path';
import { PassThrough } from 'stream';
import ImageDefinition from '../../imagedef';
import { Config } from '../../types/Config';
import { Mime } from '../../types/Format';
import assetsFolder from '../assets/dirname';
import { Response } from '../utils/expressMocks';
import { respond } from './../../spacechop';

const randomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const createStream = ({length = 100, slices = 10, interval = 5} = {}) => {
  if (length % slices !== 0) {
    throw new Error('Length must be divisible by slices');
  }
  const chunks = [];
  for (let i = 0; i < slices; i++) {
    chunks.push(randomString(length / slices));
  }
  const stream = new PassThrough();
  let j = 0;
  const timer = setInterval(() => {
    stream.push(Buffer.from(chunks[j++]));
    if (j === slices) {
      clearInterval(timer);
      stream.push(null);
    }
  }, interval);
  return stream;
 };


describe('Respond', () => {
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

  const mime: Mime =  'image/jpeg';

  describe('Default', () => {
    let response;
    beforeAll(async () => {
      response = new Response();
      await respond(response, createStream(), mime, config);
    });

    it('should set `Transfer-Encoding: chunked`', () => {
      expect(response.set.mock.calls).toContainEqual(
        expect.arrayContaining(['Transfer-Encoding', 'chunked']),
      );
    });

    it('should set `Content-Type` based on the state', () => {
      expect(response.set.mock.calls).toContainEqual(
        expect.arrayContaining(['Content-Type', 'image/jpeg']),
      );
    });
  });
  describe('`disableChunkedEncoding` = true', () => {
    const chunkedConfig = {
      ...config,
      disableChunkedEncoding: true,
    };

    let response;
    beforeAll(async () => {
      response = new Response();
      await respond(response, createStream(), mime, chunkedConfig);
    });

    it('should set `Content-Type` based on the state', () => {
      expect(response.set.mock.calls).toContainEqual(
        expect.arrayContaining(['Content-Type', 'image/jpeg']),
      );
    });

    it('should set `Content-Length` based on the stream', () => {
      // The stream's size is 100 bytes
      expect(response.set.mock.calls).toContainEqual(
        expect.arrayContaining(['Content-Length', '100']),
      );
    });
  });
});

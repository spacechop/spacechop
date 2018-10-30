import request from 'request';
import createMockServer from '../../test/utils/createMockServer';
import ResponseMonitor, { hijack } from '../response-monitor';


const promiseRequest = (uri, options?) => new Promise((resolve, reject) => {
  request(uri, options, (error, response, body) => {
    if (error) {
      reject(error);
      return;
    }
    resolve({ response, body });
  });
});

describe('response-monitor', () => {
  describe('hijack', () => {
    it('should call original function with same parameter', () => {
      const writeHead = jest.fn();
      hijack(writeHead)(200, { body: true });
      expect(writeHead).toBeCalledWith(200, { body: true });
    });

    it('should return a function', () => {
      const writeHead = hijack(null);
      expect(typeof writeHead).toBe('function');
    });
  });

  describe('response-monitor#monitor', () => {
    let monitorResult;
    let server;
    beforeAll(async () => {
      let monitor;
      server = await createMockServer(7002, (req, res) => {
        const m = new ResponseMonitor(res);
        monitor = m.monitor();
        res.set('header', 'some-header');
        res.status(200);
        res.end();
      });

      await promiseRequest('http://localhost:7002/some-path');
      monitorResult = await monitor;
    });

    afterAll(async () => {
      await server.close();
    });

    it('should collect headers', () => {
      expect(monitorResult.headers).toEqual(expect.objectContaining({
        header: 'some-header',
      }));
    });

    it('should collect response status', () => {
      expect(monitorResult.statusCode).toBe(200);
    });
  });
});

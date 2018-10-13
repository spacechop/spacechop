import compilePath from '../../lib/compile-path';

describe('monitoring', () => {
  let chokidar;
  let cluster;
  let os;
  let request;
  let load;
  const cpus = 2;

  const fetch = (uri: string): Promise<any> => new Promise(
    (resolve, reject) => request(uri, (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res);
    }),
  );

  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    chokidar = require('chokidar');
    cluster = require('cluster');
    request = require('request');
    os = require('os');
    load = require('../../config/load').default;

    jest.mock('chokidar');
    jest.mock('cluster');
    jest.mock('os');
    jest.mock('../../config/load');
    // mocking number of cpus.
    os.cpus = jest.fn(() => Array.from(new Array(cpus)));
    // mocking chokidar.
    chokidar.watch = jest.fn(() => chokidar);
    chokidar.on = jest.fn();
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('worker should start monitoring', () => {
    let server;
    let config;

    beforeEach(async () => {
      // Mock being worker node.
      Object.defineProperty(cluster, 'isMaster', { value: false });
      process.env.PORT = '3001';
      server = require('../..').server;
      config = await load('/config.yml');
    });

    afterEach(() => {
      server.close();
    });

    it('should monitor missing preset', async () => {
      const path = config.paths[0];
      const params = {
        preset: 'preset',
        image: 'image',
      };
      const compiled = compilePath(path, params);
      const uri = `http://localhost:3001${compiled}`;
      const { statusCode } = await fetch(uri);
      expect(statusCode).toEqual(404);
      // Check updated health.
      const health = `http://localhost:3001/_health`;
      const { body } = await fetch(health);
      expect(body).toMatch(/response_status_code{code=\"404\"} 1/i);
    });

    it('should monitor missing image', async () => {
      const path = config.paths[0];
      const params = {
        preset: Object.keys(config.presets)[0],
        image: 'image',
      };
      const compiled = compilePath(path, params);
      const uri = `http://localhost:3001${compiled}`;
      const { statusCode } = await fetch(uri);
      expect(statusCode).toEqual(404);
      // Check updated health.
      const health = `http://localhost:3001/_health`;
      const { body } = await fetch(health);
      expect(body).toMatch(/response_status_code{code=\"404\"} 1/i);
    });

    it('should monitor existing image from source', async () => {
      const path = config.paths[0];
      const preset = Object.keys(config.presets)[0];
      const image = 'cat.jpg';
      const params = { preset, image };
      const compiled = compilePath(path, params);
      const uri = `http://localhost:3001${compiled}`;
      const { statusCode } = await fetch(uri);
      expect(statusCode).toEqual(200);
      // Check updated health.
      const health = `http://localhost:3001/_health`;
      const { body } = await fetch(health);
      expect(body).toMatch(new RegExp(`response_status_code{code="200"} 1`));
      expect(body).toMatch(new RegExp(`response_time_sum \\d+`));
      expect(body).toMatch(new RegExp(`response_time_count 1`));
      expect(body).toMatch(new RegExp(`response_time_storage{mode="MISS"} \\d+`));
      expect(body).toMatch(new RegExp(`response_time_preset{preset="${preset}"} \\d+`));
      expect(body).toMatch(new RegExp(`response_time_original{key="[^"]+"} \\d+`));
      expect(body).toMatch(new RegExp(`transformations_mime{mime="image/jpeg"} 1`));
      expect(body).toMatch(new RegExp(`transformations_storage{mode="MISS"} 1`));
      expect(body).toMatch(new RegExp(`transformations_preset{preset="${preset}"} 1`));
      expect(body).toMatch(new RegExp(`transformations_original{key="[^"]+"} 1`));
      expect(body).toMatch(new RegExp(`bytes_storage{mode="MISS"} \\d+`));
      expect(body).toMatch(new RegExp(`bytes_mime{mime="image/jpeg"} \\d+`));
      expect(body).toMatch(new RegExp(`bytes_preset{preset="${preset}"} \\d+`));
      expect(body).toMatch(new RegExp(`bytes_original{key="[^"]+"} \\d+`));
    });
  });
});

describe('main program', () => {
  let chokidar;
  let cluster;
  let express;
  let os;
  const cpus = 2;
  const expressMocks = {
    disable: jest.fn(),
    get: jest.fn(),
    use: jest.fn(),
    listen: jest.fn(),
  };
  const expressRouterMocks = {
    get: jest.fn(),
    use: jest.fn(),
  };

  beforeEach(() => {
    jest.resetModules();
    chokidar = require('chokidar');
    cluster = require('cluster');
    express = require('express');
    os = require('os');

    jest.mock('chokidar');
    jest.mock('cluster');
    jest.mock('express');
    jest.mock('os');
    // mocking number of cpus.
    os.cpus = jest.fn(() => Array.from(new Array(cpus)));
    // mocking express.
    express.Router = jest.fn(() => expressRouterMocks);
    express.mockImplementation(() => expressMocks);
    // mocking chokidar.
    chokidar.watch = jest.fn(() => chokidar);
    chokidar.on = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('master should create worker nodes', () => {
    beforeEach(() => {
      // Mock being worker node.
      Object.defineProperty(cluster, 'isMaster', { value: true });
      require('../..');
    });

    it('should create 4 workers', () => {
      expect(os.cpus as jest.Mock).toHaveBeenCalled();
      expect(cluster.fork).toHaveBeenCalledTimes(cpus);
    });
  });

  describe('worker should listen to config', () => {
    beforeEach(() => {
      // Mock being worker node.
      Object.defineProperty(cluster, 'isMaster', { value: false });
      require('../..');
    });

    it('should start listening to config changes', () => {
      expect(chokidar.watch).toHaveBeenCalled();
    });
  });

  describe('worker should listen to port', () => {
    beforeEach(() => {
      // Mock being worker node.
      Object.defineProperty(cluster, 'isMaster', { value: false });
      require('../..');
    });

    it('should start listening to config changes', () => {
      expect(expressMocks.listen).toHaveBeenCalled();
    });
  });
});

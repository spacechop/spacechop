describe('main program', () => {
  let chokidar;
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
    jest.resetAllMocks();
    jest.restoreAllMocks();
    chokidar = require('chokidar');
    express = require('express');
    os = require('os');

    jest.mock('chokidar');
    jest.mock('express');
    jest.mock('../../config/load');
    // mocking express.
    express.Router = jest.fn(() => expressRouterMocks);
    express.mockImplementation(() => expressMocks);
    // mocking chokidar.
    chokidar.watch = jest.fn(() => chokidar);
    chokidar.on = jest.fn();
  });

  afterEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('should listen to config', () => {
    beforeEach(() => {
      require('../..');
    });

    it('should start listening to config changes', () => {
      expect(chokidar.watch).toHaveBeenCalled();
    });
  });

  describe('should start monitoring', () => {
    beforeEach(() => {
      // Mock being worker node.
      require('../..');
    });

    it('should handle monitor check', () => {
      expect(expressMocks.get).toHaveBeenCalledWith('/_health', expect.any(Function));
      const monitorResponder = expressMocks.get.mock.calls[0][1];
      const monitorResponseMock = {
        end: jest.fn(),
      };
      monitorResponder(null, monitorResponseMock);
      expect(monitorResponseMock.end).toHaveBeenCalled();
    });
  });
});

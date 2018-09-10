import { PassThrough } from 'stream';
import Storage from '../../storage';
import fetchFromStorage from './../fetch-from-storage';

describe('fetchFromStorage', () => {
  describe('200 source', () => {
    const mockStreamResponse = { stream: new PassThrough(), contentType: 'image/jpeg' };
    const mockStorage: Storage = {
      exists: jest.fn(() => Promise.resolve(true)),
      stream: jest.fn(() => Promise.resolve(mockStreamResponse)),
      upload: jest.fn(),
    };

    let result;
    beforeAll(async () => {
      result = await fetchFromStorage(mockStorage, 'some-params');
    });

    it('should call .exist with correct params', () => {
      expect(mockStorage.exists).toHaveBeenCalledWith('some-params');
    });
    it('should call .stream with correct params', () => {
      expect(mockStorage.stream).toHaveBeenCalledWith('some-params');
    });

    it('should resolve mockStreamResponse', () => {
      expect(result).toBe(mockStreamResponse);
    });
  });
  describe('404 source', () => {
    const mockStorage: Storage = {
      exists: jest.fn(() => Promise.resolve(false)),
      stream: jest.fn(() => Promise.resolve()),
      upload: jest.fn(),
    };

    beforeAll(async () => {
      await fetchFromStorage(mockStorage, 'some-params');
    });

    it('should call .exist with correct params', () => {
      expect(mockStorage.exists).toHaveBeenCalledWith('some-params');
    });

    it('should not call .stream', () => { // since .exist returns false
      expect(mockStorage.stream).not.toHaveBeenCalled();
    });
  });
  describe('500 source', () => {
    const mockStorage: Storage = {
      exists: jest.fn(() => Promise.reject(new Error())),
      stream: jest.fn(() => Promise.reject(new Error())),
      upload: jest.fn(),
    };

    let errorThrown;
    beforeAll(async () => {
      try {
        await fetchFromStorage(mockStorage, 'some-params');
      } catch (err) {
        errorThrown = err;
      }
    });

    it('should call .exist with correct params', () => {
      expect(mockStorage.exists).toHaveBeenCalledWith('some-params');
    });

    it('should not call .stream', () => { // since .exist rejected
      expect(mockStorage.stream).not.toHaveBeenCalled();
    });

    it('should throw error', () => {
      expect(errorThrown).toBeDefined();
    });
  });
});

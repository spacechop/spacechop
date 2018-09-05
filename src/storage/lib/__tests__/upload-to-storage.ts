import Storage from '../../storage';
import { PassThrough } from 'stream';
import uploadToStorage from '../upload-to-storage';

describe('uploadToStorage', () => {
  describe('200 source', () => {
    const mockStorage: Storage = {
      exists: jest.fn(),
      stream: jest.fn(),
      upload: jest.fn(() => Promise.resolve())
    };

    const stream = new PassThrough();
    beforeAll(async () => {
      await uploadToStorage(mockStorage, 'some-params', stream, 'image/jpeg');
    })

    it('should call .upload with correct params', () => {
      expect(mockStorage.upload).toHaveBeenCalledWith('some-params', stream, 'image/jpeg');
    })
  });
  describe('500 source', () => {
    const mockStorage: Storage = {
      exists: jest.fn(),
      stream: jest.fn(),
      upload: jest.fn(() => Promise.reject(new Error()))
    };

    let errorThrown;
    beforeAll(async () => {
      try {
        await uploadToStorage(mockStorage, 'some-params', new PassThrough(), 'image/jpeg');
      } catch(err) {
        errorThrown = err;
      }
    })
    it('should throw error', () => {
      expect(errorThrown).toBeDefined();
    })
  });
});

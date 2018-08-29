import requestAsyncWrapper from './../requestAsyncWrapper';
describe('requestAsyncWrapper', () => {
  it('should call fn with req and res', () => {
    const res = jest.fn();
    const req = jest.fn();
    const fn = jest.fn();
    
    const wrapped = requestAsyncWrapper(fn, () => {});
    wrapped(req, res);

    expect(fn).toBeCalledWith(req, res);
  });
  
  it('should call errorHandler if fn rejects', async () => {
    const res = jest.fn();
    const req = jest.fn();
    const error = new Error();
    const fn = jest.fn(() => Promise.reject(error));
    const errorHandler = jest.fn();
    const wrapped = requestAsyncWrapper(fn, () => errorHandler);
    await wrapped(req, res);
  
    expect(errorHandler).toHaveBeenCalledWith(error);
  });
});

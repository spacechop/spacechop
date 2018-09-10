import { handleError } from './../../spacechop';
jest.mock('../../lib/console');
describe('handleError', () => {
  const error = new Error('Some message');
  const res = {
    status: jest.fn(),
    end: jest.fn(),
  };
  beforeAll(() => {
    const errorHandler = handleError(res);
    errorHandler(error);
  });

  it('should set status = 500', () => {
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('should call end with error message', () => {
    expect(res.end).toHaveBeenCalledWith('Some message');
  });
});

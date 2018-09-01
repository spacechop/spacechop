import console from '../../lib/console';
import time from '../time';

jest.mock('../../lib/console');

describe('Time', () => {
  const date: Date = new Date();
  const process: number = 1;
  const message: string = 'hello world';

  beforeAll(() => {
    time(process, message);
    for (let i = 0; i < 1000; i++) {
      continue;
    }
    time(process, message);
  });

  it('should write time', () => {
    expect(console.info.mock.calls[0]).toBe(
      expect.stringMatching(new RegExp(`${date.toISOString()}`)),
    );
    // expect(row).toMatch(new RegExp(`${date.toISOString()}`));
  });

  it('should write process number', () => {
    // expect(row).toMatch(new RegExp(`#${process}`));
  });

  it('should write message', () => {
    // expect(row).toMatch(new RegExp(`: ${message}`));
  });
});

import build from '../build';

describe('Build', () => {
  const date: Date = new Date();
  const process: number = 1;
  const message: string = 'hello world';
  const row = build(process, message, date);

  it('should write time', () => {
    expect(row).toMatch(new RegExp(`${date.toISOString()}`));
  });

  it('should write process number', () => {
    expect(row).toMatch(new RegExp(`#${process}`));
  });

  it('should write message', () => {
    expect(row).toMatch(new RegExp(`: ${message}`));
  });
});

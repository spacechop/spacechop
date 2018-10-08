import Config from '../Config';

describe('validate Config', () => {
  it('should fail invalid config', () => {
    const config = {};
    expect(() => Config.check(config)).toThrowErrorMatchingSnapshot();
  });
});

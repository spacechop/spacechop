import serialize from '../serialize';

describe('Serialize', () => {
  describe('should handle object', () => {
    it('null', () => {
      const obj = null;
      const out = serialize(obj);
      expect(typeof out).toBe('string');
      expect(out).toBe('null');
    });

    it('empty', () => {
      const obj = {};
      const out = serialize(obj);
      expect(typeof out).toBe('string');
      expect(out).toBe('{}');
    });

    it('default', () => {
      const obj = {
        a: 1,
        b: 2,
      };
      const out = serialize(obj);
      expect(typeof out).toBe('string');
      expect(out).toBe('{"a":1,"b":2}');
    });

    it('nested', () => {
      const obj = {
        a: 1,
        b: 2,
        c: {
          a: 1,
          b: 1,
        },
      };
      const out = serialize(obj);
      expect(typeof out).toBe('string');
      expect(out).toBe('{"a":1,"b":2,"c":{"a":1,"b":1}}');
    });
  });

  describe('should handle string', () => {
    it('empty', () => {
      const str = '';
      const out = serialize(str);
      expect(typeof out).toBe('string');
      expect(out).toBe('');
    });

    it('default', () => {
      const str = 'hello world';
      const out = serialize(str);
      expect(typeof out).toBe('string');
      expect(out).toBe('hello world');
    });
  });

  describe('should handle number', () => {
    it('NaN', () => {
      const num = NaN;
      const out = serialize(num);
      expect(typeof out).toBe('string');
      expect(out).toBe('null');
    });

    it('undefined', () => {
      const num = undefined;
      const out = serialize(num);
      expect(typeof out).toBe('string');
      expect(out).toBe('undefined');
    });

    it('default', () => {
      const num = 1;
      const out = serialize(num);
      expect(typeof out).toBe('string');
      expect(out).toBe('1');
    });

    it('negative', () => {
      const num = -1;
      const out = serialize(num);
      expect(typeof out).toBe('string');
      expect(out).toBe('-1');
    });

    it('large', () => {
      const num = 10 ** 10000;
      const out = serialize(num);
      expect(typeof out).toBe('string');
      expect(out).toBe('Infinity');
    });
  });

  describe('should handle array', () => {
    it('empty', () => {
      const arr = [];
      const out = serialize(arr);
      expect(typeof out).toBe('string');
      expect(out).toBe('[]');
    });

    it('default', () => {
      const arr = [1, 'hej', -1, NaN];
      const out = serialize(arr);
      expect(typeof out).toBe('string');
      expect(out).toBe('[1,"hej",-1,null]');
    });
  });
});

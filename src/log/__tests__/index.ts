import { buildLogRow, serialize, time } from '..';

describe('Logging', () => {
  describe('Log row', () => {
    const date: Date = new Date();
    const process: number = 1;
    const message: string = 'hello world';
    const row = buildLogRow(process, message, null, date);

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

  describe('Serialize', () => {
    describe('should handle object', () => {
      it('null', () => {
        const obj = null;
        const out = serialize(obj);
        expect(typeof out).toBe('string');
        expect(out).toMatchSnapshot();
      });

      it('empty', () => {
        const obj = {};
        const out = serialize(obj);
        expect(typeof out).toBe('string');
        expect(out).toMatchSnapshot();
      });

      it('default', () => {
        const obj = {
          a: 1,
          b: 2,
        };
        const out = serialize(obj);
        expect(typeof out).toBe('string');
        expect(out).toMatchSnapshot();
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
        expect(out).toMatchSnapshot();
      });
    });

    describe('should handle string', () => {
      it('empty', () => {
        const str = '';
        const out = serialize(str);
        expect(typeof out).toBe('string');
        expect(out).toMatchSnapshot();
      });

      it('default', () => {
        const str = 'hello world';
        const out = serialize(str);
        expect(typeof out).toBe('string');
        expect(out).toMatchSnapshot();
      });
    });

    describe('should handle number', () => {
      it('NaN', () => {
        const num = NaN;
        const out = serialize(num);
        expect(typeof out).toBe('string');
        expect(out).toMatchSnapshot();
      });

      it('undefined', () => {
        const num = undefined;
        const out = serialize(num);
        expect(typeof out).toBe('string');
        expect(out).toMatchSnapshot();
      });

      it('default', () => {
        const num = 1;
        const out = serialize(num);
        expect(typeof out).toBe('string');
        expect(out).toMatchSnapshot();
      });

      it('negative', () => {
        const num = -1;
        const out = serialize(num);
        expect(typeof out).toBe('string');
        expect(out).toMatchSnapshot();
      });

      it('large', () => {
        const num = 10 ** 10000;
        const out = serialize(num);
        expect(typeof out).toBe('string');
        expect(out).toMatchSnapshot();
      });
    });
  });

  it('should write to log', () => {
    time(1, 'crop');
    time(1, 'crop');

    time(1, 'resize');
    for (let i = 0; i < 10000; i++) {
      ;
    }
    time(1, 'resize');

    time(1, 'compress');
    for (let i = 0; i < 50000; i++) {
      ;
    }
    time(1, 'compress');
  });
});

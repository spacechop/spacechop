import { PassThrough, Readable } from 'stream';
import AsyncBuffer from './../asyncBuffer';
const randomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

interface BufferingStream extends Readable {
  allData?: string;
}

const bufferingStream = ({length = 100, slices = 10, interval = 5} = {}) => {
 if (length % slices !== 0) {
   throw new Error('Length must be divisible by slices');
 }
 const chunks = [];
 for (let i = 0; i < slices; i++) {
   chunks.push(randomString(length / slices));
 }
 const stream = new PassThrough() as BufferingStream;
 let j = 0;
 const timer = setInterval(() => {
   stream.push(Buffer.from(chunks[j++]));
   if (j === slices) {
     clearInterval(timer);
     stream.push(null);
   }
 }, interval);

 stream.allData = chunks.join('');
 return stream;
};


describe('AsyncBuffer', () => {
  describe('.waitForSize', () => {
    it('should resolve when requested size is less than actual', async () => {
      expect.assertions(1);
      const stream = bufferingStream({ length: 100, slices: 10 });
      const buffer = new AsyncBuffer(stream);
      return expect(buffer.waitForSize(20)).resolves.toBe(undefined);
    });
    it('should resolve when requested size is equal to actual', async () => {
      expect.assertions(1);
      const stream = bufferingStream({ length: 100, slices: 10 });
      const buffer = new AsyncBuffer(stream);
      return expect(buffer.waitForSize(100)).resolves.toBe(undefined);
    });
    it('should resolve when requested size is more than actual', async () => {
      expect.assertions(1);
      const stream = bufferingStream({ length: 100, slices: 10 });
      const buffer = new AsyncBuffer(stream);
      return expect(buffer.waitForSize(120)).resolves.toBe(undefined);
    });
    it('should resolve when called, if the stream is already fully consumed', async () => {
      expect.assertions(1);
      const stream = bufferingStream({ length: 100, slices: 10 });
      const buffer = new AsyncBuffer(stream);
      // after this the stream is fully consumed
      await buffer.waitForSize(120);
      return expect(buffer.waitForSize(140)).resolves.toBe(undefined);
    });
  });

  describe('.ended', () => {
    it('should be false when stream has not been fully consumed', async () => {
      const stream = bufferingStream({ length: 100, slices: 10 });
      const buffer = new AsyncBuffer(stream);
      await buffer.waitForSize(20);
      expect(buffer.ended).toBe(false);
    });
    it('should be true when stream has been fully consumed', async () => {
      const stream = bufferingStream({ length: 100, slices: 10 });
      const buffer = new AsyncBuffer(stream);
      await buffer.waitForSize(120);
      expect(buffer.ended).toBe(true);
    });
  });

  describe('.buffer', () => {
    it('should contain correct data on completion', async () => {
      const stream = bufferingStream({ length: 100, slices: 10 });
      const buffer = new AsyncBuffer(stream);
      await buffer.waitForSize(120);
      expect(buffer.buffer.toString()).toEqual(stream.allData);
    });
  });
});

import { PassThrough, Stream } from 'stream';
import AsyncBuffer from '../../../lib/asyncBuffer';
import isWEBP from '../webp';
const streamFromString = (str: string): Stream => {
  const stream = new PassThrough();
  setTimeout(() => {
    const buf = Buffer.from(str);
    stream.push(buf);
    stream.push(null);
  }, 0);
  return stream;
};
describe('types - webp', () => {
  it('should return false if its not a webp header', async () => {
    const stream = streamFromString('RIFF');
    const buffer = new AsyncBuffer(stream);
    const res = await isWEBP(buffer);
    expect(res).toBeFalsy();
  });

  it('should return object if its a webp header', async () => {
    const stream = streamFromString('RIFF9999WEBP');
    const buffer = new AsyncBuffer(stream);
    const res = await isWEBP(buffer);
    expect(typeof res).toBe('object');
  });
});

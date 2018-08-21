import fs from 'fs';
import { Readable } from 'stream';
import StreamSwitch from './stream-switch';

const data = fs.readFileSync(__filename).toString();

describe('stream-switch', () => {
  let sourceStream;
  beforeEach(() => {
    sourceStream = fs.createReadStream(__filename);
  });

  describe('createReadStream', () => {
    it('should return readable stream', () => {
      const streamSwitch = new StreamSwitch(sourceStream);
      expect(streamSwitch.createReadStream()).toBeInstanceOf(Readable);
    });


    it('should contain the same data as source stream', async () => {
      const streamSwitch = new StreamSwitch(sourceStream);
      const readStream = streamSwitch.createReadStream();

      const streamedData = await new Promise((resolve) => {
        const chunks = [];
        readStream.on('data', (chunk) => chunks.push(chunk));
        readStream.on('end', () => resolve(Buffer.concat(chunks).toString()));
      });
      expect(streamedData).toBe(data);
    });


    it('should pipe to one consumer independently of other consumers', async () => {
      const streamSwitch = new StreamSwitch(sourceStream);
      const readStream1 = streamSwitch.createReadStream();
      const readStream2 = streamSwitch.createReadStream();

      const success = await new Promise((resolve) => {
        readStream1.on('end', () => resolve(true));
        readStream1.resume();
        readStream2.pause();
      });
      expect(success).toBe(true);
    });


    it('should push correct amount of bytes', async () => {
      const streamSwitch = new StreamSwitch(sourceStream);
      const readStream1 = streamSwitch.createReadStream();
      const readStream2 = streamSwitch.createReadStream();

      const bytesLength = await new Promise((resolve) => {
        const chunks = [];
        readStream1.on('data', (chunk) => chunks.push(chunk));
        readStream1.on('end', () => resolve(Buffer.concat(chunks).length));
        readStream2.resume();
      });
      expect(bytesLength).toBe(data.length);
    });
  });
});

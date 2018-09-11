import { Stream } from 'stream';

interface Waiting {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
  size: number;
}

export default class AsyncBuffer {
  public buffer: Buffer;
  public ended: boolean;
  private error: any;
  private waiting: Waiting[];

  constructor(stream: Stream) {
    this.buffer = Buffer.alloc(0);
    this.waiting = [];
    this.ended = false;

    stream.on('data', (chunk) => {
      this.buffer = Buffer.concat([this.buffer, chunk]);
      this.resolveWaiting();
    });
    stream.on('end', () => {
      this.ended = true;
      this.resolveWaiting();
    });
    stream.on('error', (error) => {
      this.error = error;
      this.ended = true;
      this.resolveWaiting();
    });
  }

  public waitForSize(size: number) {
    if (this.ended) {
      return Promise.resolve();
    }
    if (size <= this.buffer.length) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      this.waiting.push({ resolve, reject, size });
    });
  }

  private resolveWaiting() {
    this.waiting = this.waiting.filter((waiting) => {
      if (this.error) {
        waiting.reject(this.error);
        return false;
      }
      if (this.ended) {
        waiting.resolve();
        return false;
      }

      if (this.buffer.length >= waiting.size) {
        waiting.resolve();
        return false;
      }
      return true;
    });
  }
}

import { ReadableOptions, Stream } from 'stream';
import SourceEmitter from './source-emitter';

export default class StreamSwitch {
  public sourceStream: Stream;
  public buffers: Buffer[];
  public bufferLength: number;
  public bufferPromises: {};
  public bufferResolvers: {};

  constructor(sourceStream) {
    this.sourceStream = sourceStream;
    this.buffers = [];
    this.bufferLength = 0;
    this.bufferPromises = {};
    this.bufferResolvers = {};

    this.startBuffering();
  }

  public startBuffering() {
    this.sourceStream
      .on('data', (chunk) => {
        this.buffers[this.bufferLength] = chunk;
        this.resolveChunk(this.bufferLength, chunk);
        this.bufferLength += 1;
      })
      .on('end', () => {
        this.requestChunk(this.bufferLength);

        // Resolve all unresolved requests for chunks with null.
        // This will tell the consuming streams that there are no more data to consume.

        for (const index in this.bufferResolvers) {
          if (
            Object.prototype.hasOwnProperty.call(this.bufferResolvers, index)
            && parseInt(index, 10) >= this.bufferLength) {
            this.bufferResolvers[index](null);
          }
        }
      });
  }


  public createReadStream(options?: ReadableOptions) {
    return new SourceEmitter(this, options);
  }

  public read(index) {
    return this.requestChunk(index);
  }

  private requestChunk(index) {
    if (!this.bufferPromises[index]) {
      this.bufferPromises[index] = new Promise((resolve) => {
        this.bufferResolvers[index] = resolve;
      });
    }
    return this.bufferPromises[index];
  }

  private resolveChunk(index, chunk) {
    this.requestChunk(index);
    this.bufferResolvers[index](chunk);
  }
}


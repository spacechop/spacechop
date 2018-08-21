import { Readable, ReadableOptions } from 'stream';
import StreamSwitch from './stream-switch';

export default class SourceEmitter extends Readable {
  public streamSwitch: StreamSwitch;
  public readIndex: number;

  constructor(streamSwitch: StreamSwitch, options?: ReadableOptions) {
    super(options);
    this.streamSwitch = streamSwitch;
    this.readIndex = 0;
  }

  public _read() {
    this.streamSwitch.read(this.readIndex)
      .then((chunk) => {
        if (chunk) {
          this.readIndex += 1;
        }
        this.push(chunk);
      });
  }
}

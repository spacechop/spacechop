import { Stream } from 'stream';

export default interface Storage {
  upload(params: any, stream: Stream): Promise<void>;
  exists(params: any): Promise<boolean>;
  stream(params: any): Stream;
}

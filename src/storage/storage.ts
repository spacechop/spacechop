import { Mime } from '@spacechop/types';
import { Stream } from 'stream';

export interface StorageStreamResult {
  stream: Stream;
  contentType?: Mime;
}

export default interface Storage {
  upload(params: any, stream: Stream, contentType: Mime): Promise<void>;
  exists(params: any): Promise<boolean>;
  stream(params: any): Promise<StorageStreamResult>;
}

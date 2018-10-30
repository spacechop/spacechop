import { Stream } from 'stream';
import { Mime } from '../types/Format';

export interface StorageStreamResult {
  key: string;
  stream: Stream;
  contentType?: Mime;
}

export default interface Storage {
  upload(params: any, stream: Stream, contentType: Mime): Promise<void>;
  exists(params: any): Promise<boolean>;
  stream(params: any): Promise<StorageStreamResult>;
}

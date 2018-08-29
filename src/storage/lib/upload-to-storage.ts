import Storage from './../storage';
import { Mime } from '../../types/Format';
import { Stream } from 'stream';

export default (storage: Storage, params: any, stream: Stream, contentType: Mime): Promise<void> => {
  return storage.upload(params, stream, contentType);
}

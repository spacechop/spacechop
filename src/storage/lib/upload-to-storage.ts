import { Stream } from 'stream';
import { Mime } from '../../types/Format';
import Storage from './../storage';

export default (storage: Storage, params: any, stream: Stream, contentType: Mime): Promise<void> => {
  return storage.upload(params, stream, contentType);
};

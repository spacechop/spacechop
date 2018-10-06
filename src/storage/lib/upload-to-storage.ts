import { Mime } from '@spacechop/types';
import { Stream } from 'stream';
import Storage from './../storage';

export default (storage: Storage, params: any, stream: Stream, contentType: Mime): Promise<void> => {
  return storage.upload(params, stream, contentType);
};

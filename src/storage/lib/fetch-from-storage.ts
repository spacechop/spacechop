import { Stream } from 'stream';
import { Mime } from '../../types/Format';
import Storage from '../storage';

export interface StorageFetchResult {
  key: string;
  stream: Stream;
  contentType?: Mime;
}

export default async (storage: Storage, params: any): Promise<StorageFetchResult> => {
  const exists = await storage.exists(params);
  if (exists) {
    return storage.stream(params);
  } else {
    return null;
  }
};

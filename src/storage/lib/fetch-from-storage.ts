import Storage from "../storage";
import { Mime } from "../../types/Format";
import { Stream } from "stream";

export type StorageFetchResult = {
  stream: Stream,
  contentType?: Mime
};

export default async (storage: Storage, params: any): Promise<StorageFetchResult> => {
  const exists = await storage.exists(params);
  if (exists) {
    return storage.stream(params);
  } else {
    return null;
  }
};

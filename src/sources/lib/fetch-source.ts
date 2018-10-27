import { Stream } from 'stream';
import SourceInstances from '../sources';

export default async (
  sources: SourceInstances,
  params: any,
  source?: string,
): Promise<Stream> => {
  for (const member of Object.keys(sources)) {
    if (!source || member === source) {
      const instance = sources[member];
      if (await instance.exists(params)) {
        return instance.stream(params);
      }
    }
  }
  return null;
};

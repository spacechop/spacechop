import { Stream } from 'stream';
import SourceInstances from '../sources';

export default async (sources: SourceInstances, params: any): Promise<Stream> => {
  for (const key of Object.keys(sources.originals)) {
    const source = sources.originals[key];
    if (await source.exists(params)) {
      return source.stream(params);
    }
  }
  return null;
};

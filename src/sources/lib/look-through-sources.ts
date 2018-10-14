import { Stream } from 'stream';
import SourceInstances from '../sources';

export default async (sources: SourceInstances, params: any): Promise<Stream> => {
  for (const key of Object.keys(sources)) {
    const source = sources[key];
    if (source.original && await source.instance.exists(params)) {
      return source.instance.stream(params);
    }
  }
  return null;
};

import Source from './../source';
import { Stream } from 'stream';

export default async (sources: Source[], params: any): Promise<Stream> => {
  for (const source of sources) {
    if (await source.exists(params)) {
      return source.stream(params);
    }
  }
  return null;
};

import { Stream } from 'stream';
import Source from './../source';

interface SourceStream {
  stream: Stream;
  key?: string;
}

export default async (sources: Source[], params: any): Promise<SourceStream> => {
  for (const source of sources) {
    if (await source.exists(params)) {
      const key = source.key(params);
      const stream = source.stream(params);
      return { stream, key };
    }
  }
  return { stream: null };
};

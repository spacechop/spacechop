import { PassThrough, Readable } from 'stream';
import countBytes from '../lib/countBytes';
import extractMime from '../lib/extractMime';
import { Mime } from '../types/Mime';

export interface TransformationHeaders {
  contentType: Mime;
  contentLength: number;
}
export default async (stream: Readable): Promise<TransformationHeaders> => {
  // .countBytes and .extractMime use the stream with two different methods
  // and to avoid issues with this its first piped to two passthroughs
  // read more here: https://nodejs.org/api/stream.html#stream_choose_one

  const pt1 = new PassThrough();
  const pt2 = new PassThrough();
  stream.pipe(pt1);
  stream.pipe(pt2);

  const [bytes, mime] = await Promise.all([
    countBytes(pt1),
    extractMime(pt2),
  ]);

  return {
    contentType: mime,
    contentLength: bytes,
  };
};

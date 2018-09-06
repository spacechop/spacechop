import { PassThrough, Stream } from 'stream';
import { Mime } from '../types/Format';
import extractStreamMeta from './extractStreamMeta';
import isStreamPNGAnimation from './isStreamPNGAnimation';

interface ImageMetaData {
  mimeType: Mime;
  geometry: {
    width: number,
    height: number,
  };
  interlace: string;
  channelDepth?: {
    alpha?: number,
  };
  alpha?: string;
  animatedGIF?: boolean;
  animatedPNG?: boolean;
}

const wrapTime = (promise, tag) => {
  return promise.then((d) => {
    console.timeEnd(tag);
    return d;
  });
};

export default async (stream: Stream, requirements = []): Promise<ImageMetaData> => {
  // XXX in case of face detection, analyze image for faces
  const readStreams = [];
  for (let i = 0; i < 2; i++) {
    readStreams[i] = new PassThrough();
    stream.pipe(readStreams[i]);
  }
  console.time('extractStreamMeta');
  console.time('isStreamPNGAnimation');
  const [meta, animatedPNG] = await Promise.all([
    wrapTime(extractStreamMeta(readStreams[0]), 'extractStreamMeta'),
    wrapTime(isStreamPNGAnimation(readStreams[1]), 'isStreamPNGAnimation'),
  ]);

  const [{ image }, ...frames] = meta;
  const animatedGIF = frames.length > 0;

  return {
    ...image,
    animatedGIF,
    animatedPNG,
  };
};

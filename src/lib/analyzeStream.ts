import { PassThrough, Stream } from 'stream';
import extractStreamMeta from './extractStreamMeta';
import isStreamPNGAnimation from './isStreamPNGAnimation';
import { Mime } from '../types/Format';

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

export default async (stream: Stream, requirements = []): Promise<ImageMetaData> => {
  // XXX in case of face detection, analyze image for faces
  const readStreams = [];
  for (let i = 0; i < 2; i++) {
    readStreams[i] = new PassThrough();
    stream.pipe(readStreams[i]);
  }
  const [meta, animatedPNG] = await Promise.all([
    extractStreamMeta(readStreams[0]),
    isStreamPNGAnimation(readStreams[1]),
  ]);

  const [{ image }, ...frames] = meta;
  const animatedGIF = frames.length > 0;

  return {
    ...image,
    animatedGIF,
    animatedPNG,
  };
};

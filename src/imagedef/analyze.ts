import { PassThrough } from 'stream';
import ImageDefinition from '.';
import extractStreamMeta from '../lib/extractStreamMeta';
import isStreamPNGAnimation from '../lib/isStreamPNGAnimation';
import { mimeToFormat } from '../types/Format';

export default async (stream, requirements): Promise<ImageDefinition> => {
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
    width: image.pageGeometry.width,
    height: image.pageGeometry.height,
    alpha: image.channelDepth && !!image.channelDepth.alpha || !!image.alpha,
    interlacing: image.interlace !== 'None',
    type: mimeToFormat(image.mimeType),
    animated: animatedGIF || animatedPNG,
  };
};

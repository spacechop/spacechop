import { Stream, PassThrough } from 'stream';
// import probeImageSize from 'probe-image-size';
import ImageDefinition, { getImageTypeFromMimeType } from '.';
import extractStreamMeta from '../lib/extractStreamMeta';

interface ImageMetaData {
  mimeType: string
  geometry: {
    width: number,
    height: number,
  },
  interlace: string,
  channelDepth?: {
    alpha: number,
  },
};

const analyzeStream = (stream: Stream): Promise<ImageMetaData> => {
  const duplex = new PassThrough();
  stream.pipe(duplex);
  return extractStreamMeta(duplex);
};

export default async (stream, requirements): Promise<ImageDefinition> => {
  // XXX in case of face detection, analyze image for faces
  const data = await analyzeStream(stream);
  const {
    mimeType,
    geometry: {
      width,
      height,
    },
    interlace,
    channelDepth,
  } = data;

  return {
    width,
    height,
    alpha: channelDepth && !!channelDepth.alpha,
    interlacing: interlace !== 'None',
    type: getImageTypeFromMimeType(mimeType),
  };
};

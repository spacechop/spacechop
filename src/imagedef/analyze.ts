import { Stream, PassThrough } from 'stream';
import probeImageSize from 'probe-image-size';
import ImageDefinition, { getImageType } from '.';

const analyzeStream = (stream: Stream): Promise<ImageDefinition> => {
  const duplex = new PassThrough();
  stream.pipe(duplex);
  return probeImageSize(stream);
};

export default async (stream, requirements): Promise<ImageDefinition> => {
  // XXX in case of face detection, analyze image for faces
  const { width, height, type } = await analyzeStream(stream);

  return {
    width,
    height,
    type: getImageType(type),
  };
};

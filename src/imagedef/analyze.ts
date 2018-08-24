import ImageDefinition, { getImageTypeFromMimeType } from '.';
import analyzeStream from '../lib/analyzeStream';

export default async (stream, requirements): Promise<ImageDefinition> => {
  const data = await analyzeStream(stream, requirements);
  const {
    mimeType,
    geometry: {
      width,
      height,
    },
    interlace,
    channelDepth,
    animatedGIF,
    animatedPNG,
  } = data;

  return {
    width,
    height,
    alpha: channelDepth && !!channelDepth.alpha,
    interlacing: interlace !== 'None',
    type: getImageTypeFromMimeType(mimeType),
    mime: mimeType,
    animated: animatedGIF || animatedPNG,
  };
};

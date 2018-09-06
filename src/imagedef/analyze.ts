import ImageDefinition from '.';
import analyzeStream from '../lib/analyzeStream';
import { mimeToFormat } from '../types/Format';

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
    alpha,
    animatedGIF,
    animatedPNG,
  } = data;

  return {
    width,
    height,
    alpha: channelDepth && !!channelDepth.alpha || !!alpha,
    interlacing: interlace !== 'None',
    type: mimeToFormat(mimeType),
    animated: animatedGIF || animatedPNG,
  };
};

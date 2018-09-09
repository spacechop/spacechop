import ImageDefinition from '.';
import analyzeStream from '../lib/analyzeStream';

export default async (stream, requirements): Promise<ImageDefinition> => {
  return analyzeStream(stream, requirements);
  // const {
  //   mimeType,
  //   geometry: {
  //     width,
  //     height,
  //   },
  //   interlace,
  //   channelDepth,
  //   alpha,
  //   animatedGIF,
  //   animatedPNG,
  // } = data;
  //
  // return {
  //   width,
  //   height,
  //   alpha: channelDepth && !!channelDepth.alpha || !!alpha,
  //   interlacing: interlace !== 'None',
  //   type,
  //   animated: animatedGIF || animatedPNG,
  // };
};

import { Stream } from 'stream';
import { ImageDefinition } from '../types';
import { PreprocessRequirements } from '../types/PreprocessRequirements';
import StreamSwitch from './stream-switch';

export default async (
  stream: Stream,
  prerequisites: PreprocessRequirements,
): Promise<ImageDefinition> => {
  const info: any = {};
  const streamSwitch = new StreamSwitch(stream);
  // in case of face detection, analyze image for faces
  for (const key of Object.keys(prerequisites)) {
    const enabled = prerequisites[key];
    if (key === 'sources' && enabled) {
      const streamToAnalyzeFaces = streamSwitch.createReadStream();
      // const faces = await facedetect(streamToAnalyzeFaces, info);
      // if (faces.length > 0) {
      //   info.faces = faces;
      // }
    }
  }

  return info;
};

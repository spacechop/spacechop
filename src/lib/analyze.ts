import { Stream } from 'stream';
import { DefinitionRequirement, ImageDefinition } from '../types';
import facedetect from './face-detection/detect';
import StreamSwitch from './stream-switch';
import types from './types';

export default async (
  stream: Stream,
  requirements: { [key: number]: DefinitionRequirement },
): Promise<ImageDefinition> => {
  const streamSwitch = new StreamSwitch(stream);
  const streamToAnalyzeTypes = streamSwitch.createReadStream();
  const info = await types(streamToAnalyzeTypes);
  // in case of face detection, analyze image for faces
  for (const i in requirements) {
    if (requirements[i] === 'faces') {
      const streamToAnalyzeFaces = streamSwitch.createReadStream();
      const faces = await facedetect(streamToAnalyzeFaces, info);
      if (faces.length > 0) {
        info.faces = faces;
      }
    }
  }
  return {
    ...info,
  };
};

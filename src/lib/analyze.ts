import { Stream } from 'stream';
import { DefinitionRequirement, ImageDefinition } from '../types';
import extractProfile from './extractProfile';
import facedetect from './face-detection/detect';
import StreamSwitch from './stream-switch';

export default async (
  stream: Stream,
  requirements: DefinitionRequirement,
): Promise<ImageDefinition> => {
  const info: any = {};
  const streamSwitch = new StreamSwitch(stream);
  // in case of face detection, analyze image for faces
  for (const key of Object.keys(requirements)) {
    const enabled = requirements[key];
    if (key === 'faces' && enabled) {
      const streamToAnalyzeFaces = streamSwitch.createReadStream();
      const faces = await facedetect(streamToAnalyzeFaces, info);
      if (faces.length > 0) {
        info.faces = faces;
      }
    }
    if (key === 'profile' && enabled) {
      const streamToExtractICC = streamSwitch.createReadStream();
      const profile = await extractProfile(streamToExtractICC);
      info.profile = profile;
    }
  }

  return info;
};

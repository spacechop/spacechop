import { Stream } from 'stream';
import ImageDefinition, { DefinitionRequirement } from '.';
import types from './types';

export default async (stream: Stream, _: DefinitionRequirement[] = []): Promise<ImageDefinition> => {
  // XXX in case of face detection, analyze image for faces
  const info = types(stream);
  return Promise.resolve(info);
};

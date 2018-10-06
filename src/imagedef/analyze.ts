import { ImageDefinition } from '@spacechop/types';
import analyzeStream from '../lib/analyzeStream';

export default async (stream, requirements): Promise<ImageDefinition> => {
  return analyzeStream(stream, requirements);
};

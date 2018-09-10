import ImageDefinition from '.';
import analyzeStream from '../lib/analyzeStream';

export default async (stream, requirements): Promise<ImageDefinition> => {
  return analyzeStream(stream, requirements);
};

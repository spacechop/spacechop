import { Readable } from 'stream';
import ImageDefinition, { Mime } from '../imagedef';
import countBytes from '../lib/countBytes';

export interface TransformationHeaders {
  contentType: Mime;
  contentLength: number;
}

export default async (stream: Readable, definition: ImageDefinition): Promise<TransformationHeaders> => {
  const bytes = await countBytes(stream);
  return {
    contentType: definition.mime,
    contentLength: bytes,
  };
};

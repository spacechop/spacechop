import probe from 'probe-image-size';
import { Readable } from 'stream';
import { Mime } from './../types/Mime';

export default async (stream: Readable): Promise<Mime> => {
  const { mime } = await probe(stream);
  return mime;
};

import { Format } from '../types/Format';
import { Mime } from '../types/Mime';

export const getImageTypeFromMimeType = (mime: string): any => {
  const type = mime.match(/^image\/(\w+)$/)[1];
  return type;
};

export interface ImageFaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum DefinitionRequirement {
  FACES = 'faces',
}

export default interface ImageDefinition {
  width: number;
  height: number;
  type: Format;
  alpha?: boolean;
  interlacing?: boolean;
  faces?: [ImageFaceBox?];
  mime?: Mime;
}

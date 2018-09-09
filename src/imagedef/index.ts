import { Format } from '../types/Format';

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
  animated?: boolean;
  size?: number;
  lossy?: boolean;
}

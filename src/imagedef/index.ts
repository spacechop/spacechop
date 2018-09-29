import { DefinitionRequirement } from '../types/DefinitionRequirement';
import { Format } from '../types/Format';

export interface ImageFaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DefinitionRequirement = DefinitionRequirement;

export default interface ImageDefinition {
  width: number;
  height: number;
  type: Format;
  alpha?: boolean;
  interlacing?: boolean;

  // Is only set if facedetection is done
  // ie. when an operation requries centering on face
  faces?: ImageFaceBox[];

  animated?: boolean;
  size?: number;
  lossy?: boolean;

  // The state from analyze.
  original: ImageDefinition;
}

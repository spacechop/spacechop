export enum ImageType {
  jpeg = 'jpeg',
  png = 'png',
  gif = 'gif',
  webp = 'webp',
};

export interface ImageFaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum DefinitionRequirement {
  FACES
};

export default interface ImageDefinition {
  width: number;
  height: number;
  type: ImageType;
  alpha?: Boolean
  interlacing?: Boolean
  faces?: [ImageFaceBox?]
};

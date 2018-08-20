export enum ImageType {
  jpeg = 'jpeg',
  png = 'png',
  gif = 'gif',
  webp = 'webp',
}

export const getImageTypeFromMimeType = (mime: string): ImageType => {
  const type = mime.match(/^image\/(\w+)$/)[1];
  return ImageType[type];
};

export interface ImageFaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum DefinitionRequirement {
  FACES = 'faces',
  ICC_PROFILE = 'icc_profile',
}

export default interface ImageDefinition {
  width: number;
  height: number;
  type: ImageType;
  alpha?: boolean;
  interlacing?: boolean;
  faces?: [ImageFaceBox?];
}

export enum ImageType {
  jpeg = 'jpeg',
  png = 'png',
  gif = 'gif',
  webp = 'webp',
}

export const getImageType = (type: string): ImageType => {
  switch (type) {
    case 'jpg':
      return ImageType['jpeg'];
    default:
      return ImageType[type];
  }
};

export interface ImageFaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum DefinitionRequirement {
  FACES,
}

export default interface ImageDefinition {
  width: number;
  height: number;
  type: ImageType;
  alpha?: boolean;
  interlacing?: boolean;
  faces?: [ImageFaceBox?];
}

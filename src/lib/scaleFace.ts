import { ImageFaceBox } from '../imagedef';

export interface ScaleFace {
  scale?: number;
  scaleX?: number;
  scaleY?: number;
}

export default (scaling: ScaleFace) => (face: ImageFaceBox): ImageFaceBox => {
  const {
    scale = 1,
    scaleX = scale,
    scaleY = scale,
  } = scaling;
  return {
    x: Math.round(face.x / scaleX),
    y: Math.round(face.y / scaleY),
    width: Math.round(face.width / scaleX),
    height: Math.round(face.height / scaleY),
  };
};

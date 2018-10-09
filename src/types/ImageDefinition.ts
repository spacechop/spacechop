import * as t from 'runtypes';
import Format from './Format';
import ImageFaceBox from './ImageFaceBox';
import PositiveNumber from './PositiveNumber';

const ImageDefinition = t.Record({
  width: PositiveNumber,
  height: PositiveNumber,
  type: Format,
}).And(t.Partial({
  alpha: t.Boolean,
  interlacing: t.Boolean,

  // Is only set if facedetection is done
  // ie. when an operation requries centering on face
  faces: t.Array(ImageFaceBox),

  animated: t.Boolean,
  size: t.Number,
  lossy: t.Boolean,
}));

export type ImageDefinition = t.Static<typeof ImageDefinition>;
export default ImageDefinition;

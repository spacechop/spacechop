import * as t from 'runtypes';
import Format from './Format';
import ImageFaceBox from './ImageFaceBox';

const ImageDefinition = t.Record({
  width: t.Number,
  height: t.Number,
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

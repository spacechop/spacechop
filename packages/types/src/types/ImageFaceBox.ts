import * as t from 'runtypes';

const ImageFaceBox = t.Record({
  x: t.Number,
  y: t.Number,
  width: t.Number,
  height: t.Number,
});

export type ImageFaceBox = t.Static<typeof ImageFaceBox>;
export default ImageFaceBox;

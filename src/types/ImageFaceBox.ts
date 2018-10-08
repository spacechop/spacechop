import * as t from 'runtypes';

const ImageFaceBox = t.Record({
  height: t.Number,
  width: t.Number,
  x: t.Number,
  y: t.Number,
});

export type ImageFaceBox = t.Static<typeof ImageFaceBox>;
export default ImageFaceBox;

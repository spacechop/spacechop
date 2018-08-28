import * as t from 'runtypes';

const Format = t.Union(
  t.Literal('jpeg'),
  t.Literal('png'),
  t.Literal('gif'),
  t.Literal('webp'),
);

const Mime = t.Union(
  t.Literal('image/jpeg'),
  t.Literal('image/png'),
  t.Literal('image/gif'),
  t.Literal('image/webp'),
);

export type Mime = t.Static<typeof Mime>;
export type Format = t.Static<typeof Format>;

export const allFormats = Format.alternatives.map((f) => f.value);
export const allMimes = Mime.alternatives.map(f => f.value);

export const formatToMime = (format: Format): Mime => {
  if (format in allFormats) {
    const mime = <Mime>('image/'+format);
    return mime;
  }
  throw new Error('Unrecognized Format ' + format);
};

export const mimeToFormat = (mime: Mime): Format => {
  if (mime in allMimes) {
    const type = <Format>mime.match(/^image\/(\w+)$/)[1];
    return type;
  }
  throw new Error('Unrecognized Mime' + mime);
};

export default Format;

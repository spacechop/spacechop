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
  switch(format) {
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
  }
  throw new Error('Unrecognized Format ' + format);
};

export default Format;

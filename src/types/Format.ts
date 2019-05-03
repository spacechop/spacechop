import * as t from 'runtypes';

const Format = t.Union(
  t.Literal('jpeg'),
  t.Literal('png'),
  t.Literal('gif'),
  t.Literal('webp'),
  t.Literal('svg'),
);

const Mime = t.Union(
  t.Literal('image/jpeg'),
  t.Literal('image/png'),
  t.Literal('image/gif'),
  t.Literal('image/webp'),
  t.Literal('image/svg+xml')
);

export type Mime = t.Static<typeof Mime>;
export type Format = t.Static<typeof Format>;

export const allFormats = Format.alternatives.map((f) => f.value);
export const allMimes = Mime.alternatives.map((f) => f.value);

export const formatToMime = (format: Format): Mime => {
  const typedFormat = Format.check(format);
  if (typedFormat === 'svg') {
    return ('image/svg+xml') as Mime;
  }
  const mime = ('image/' + typedFormat) as Mime;
  return mime;
};

export const mimeToFormat = (mime: Mime): Format => {
  const typedMime = Mime.check(mime);
  const type = typedMime.match(/^image\/(\w+)$/)[1] as Format;
  return type;
};

export const parseFormat = (value: string): Format => {
  switch (value) {
    case 'jpg':
      return 'jpeg' as Format;
    default:
      return value in allFormats ? value as Format : null;
  }
};

export default Format;

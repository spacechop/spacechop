import * as t from 'runtypes';

const pattern = /^(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i;

export default t.Record({
  http: t.Record({
    root: t.String.withConstraint(
      n => (n && n.length > 0 && pattern.test(n)) || 'Requires valid url',
    ),
  }),
});

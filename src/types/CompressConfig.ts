import * as t from 'runtypes';
import Format from './Format';

export default t.Partial({
  quality: t.Number.withConstraint(
    n => (n >= 0 && n <= 100) || 'quality must be between 0 and 100',
  ),
  lossy: t.Boolean,
});

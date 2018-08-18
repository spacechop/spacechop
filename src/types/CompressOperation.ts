import * as t from 'runtypes';
import CompressConfig from './CompressConfig';

export default t.Record({
  $compress: CompressConfig,
});

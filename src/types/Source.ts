import * as t from 'runtypes';
import HttpSourceConfig from '../sources/http/types';
import S3SourceConfig from './../sources/s3/types';

export default t.Union(
  t.Record({ http: HttpSourceConfig }),
  t.Record({ s3: S3SourceConfig }),
);

import * as t from 'runtypes';
import S3StorageConfig from '../storage/s3/types';

export default t.Union(
  t.Record({ s3: S3StorageConfig }),
);

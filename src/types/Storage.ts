import * as t from 'runtypes';
import S3StorageConfig from '../storage/s3/types';

const Storage = t.Union(
  t.Record({ s3: S3StorageConfig }),
);

export type Storage = t.Static<typeof Storage>
export default Storage;

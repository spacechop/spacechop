import * as t from 'runtypes';
import HttpSourceConfig from './sources/http';
import S3SourceConfig from './sources/s3';
import VolumeSourceConfig from './sources/volume';

const Source = t.Union(
  t.Record({ http: HttpSourceConfig }),
  t.Record({ s3: S3SourceConfig }),
  t.Record({ volume: VolumeSourceConfig }),
);

export type Source = t.Static<typeof Source>;
export default Source;

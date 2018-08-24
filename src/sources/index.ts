import HttpSource from './http';
import S3Source from './s3';
import VolumeSource from './volume';

export default {
  http: HttpSource,
  s3: S3Source,
  volume: VolumeSource,
};

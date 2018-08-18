import * as t from 'runtypes';
import S3Source from './../sources/s3/types';
import HTTPSource from './HTTPSource';

export default t.Union(HTTPSource, S3Source);

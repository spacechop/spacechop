import * as t from 'runtypes';
import HTTPSource from './HTTPSource';
import S3Source from './../sources/s3/types';

export default t.Union(HTTPSource, S3Source);

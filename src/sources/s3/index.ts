import AWS from 'aws-sdk';
import Https from 'https';
import compilePath from './../compile-path';
import { S3Config } from './types';
import Source, { SourceParams } from '../source';
import { Stream } from 'stream';

const agent = new Https.Agent({
  keepAlive: true,
  keepAliveMsecs: 3000,
  maxSockets: 100,
});

AWS.config.update({
  httpOptions: {
    agent,
  },
});

export default class S3Resolver extends Source {
  S3: any;
  bucketName: string;
  path: string;
  config: S3Config;

  constructor(config: S3Config) {
    super(config);
    this.S3 = new AWS.S3({
      accessKeyId: config.access_key_id,
      secretAccessKey: config.secret_access_key,
      region: config.region,
    });

    this.bucketName = config.bucket_name;
    this.path = config.path;
  }

  getPath({ imageAlias }) {
    const path = this.path.length > 0 ? `${this.path}/` : '';
    return `${path}${imageAlias}`;
  }

  exists(params: SourceParams): Promise<Boolean> {
    const Key = compilePath(this.config.path, params);
    const Bucket = this.config.bucket_name;

    return new Promise(resolve => {
      const query = {
        Bucket,
        Key
      };

      this.S3.headObject(query, (err, data) => {
        resolve(!err && data);
      });
    });
  }

  stream(params: SourceParams): Stream {
    const Key = compilePath(this.config.path, params);
    const Bucket = this.config.bucket_name;

    const query = {
      Bucket,
      Key
    };

    const obj = this.S3.getObject(query);
    return obj.createReadStream();
  }
}

module.exports = S3Resolver;

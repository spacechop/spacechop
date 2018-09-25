import AWS from 'aws-sdk';
import Https from 'https';
import { Stream } from 'stream';
import compilePath from '../../lib/compile-path';
import hashKey from '../../lib/hashKey';
import Source from '../source';
import { S3SourceConfig } from './types';

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

export default class S3Source implements Source {
  public S3: any;
  public bucketName: string;
  public path: string;
  public config: S3SourceConfig;

  constructor(config: S3SourceConfig) {
    this.config = config;
    let endpoint = null;
    if (config.endpoint) {
      endpoint = new AWS.Endpoint(config.endpoint);
    }
    this.S3 = new AWS.S3({
      accessKeyId: config.access_key_id,
      secretAccessKey: config.secret_access_key,
      region: config.region,
      endpoint,
    });

    this.bucketName = config.bucket_name;
    this.path = config.path;
  }

  public key(params: any): string {
    return hashKey(compilePath(this.config.path, params));
  }

  public exists(params: any): Promise<boolean> {
    const Key = compilePath(this.config.path, params);
    const Bucket = this.config.bucket_name;

    return new Promise((resolve) => {
      const query = {
        Bucket,
        Key,
      };

      this.S3.headObject(query, (err, data) => {
        resolve(!err && data);
      });
    });
  }

  public stream(params: any): Stream {
    const Key = compilePath(this.config.path, params);
    const Bucket = this.config.bucket_name;

    const query = {
      Bucket,
      Key,
    };

    const obj = this.S3.getObject(query);
    return obj.createReadStream();
  }
}

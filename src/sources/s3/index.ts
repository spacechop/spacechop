import AWS from 'aws-sdk';
import Https from 'https';
import { Stream } from 'stream';
import Source from '../source';
import compilePath from './../compile-path';
import { S3Config } from './types';

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
  public S3: any;
  public bucketName: string;
  public path: string;
  public config: S3Config;

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

  public getPath({ imageAlias }) {
    const path = this.path.length > 0 ? `${this.path}/` : '';
    return `${path}${imageAlias}`;
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

module.exports = S3Resolver;

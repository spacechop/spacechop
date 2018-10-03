import AWS from 'aws-sdk';
import Https from 'https';
import { Stream } from 'stream';
import compilePath from '../../lib/compile-path';
import { Mime } from '../../types/Format';
import Storage from '../storage';
import { S3StorageConfig } from './types';

const DEFAULT_ACL: S3StorageConfig['ACL'] = 'private';

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

export default class S3Storage implements Storage {
  public S3: AWS.S3;
  public bucketName: string;
  public path: string;
  public config: S3StorageConfig;
  public ACL: string;
  constructor(config: S3StorageConfig) {
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
    this.ACL = config.ACL || DEFAULT_ACL;
  }

  public exists(params: any): Promise<boolean> {
    const Key = compilePath(this.config.path, params);
    const Bucket = this.config.bucket_name;
    const { hash } = params;

    return new Promise((resolve) => {
      const query = {
        Bucket,
        Key,
      };

      this.S3.headObject(query, (err, data) => {
        const { Metadata: meta = {} } = data || {};
        resolve(!err && !!data && meta['x-amz-meta-hash'] === hash);
      });
    });
  }

  public stream(params: any): Promise<{ stream: Stream, contentType: Mime }> {
    const Key = compilePath(this.config.path, params);
    const Bucket = this.config.bucket_name;

    const query = {
      Bucket,
      Key,
    };

    const obj = this.S3.getObject(query);
    const stream = obj.createReadStream();
    return new Promise((resolve, reject) => {
      obj.on('error', (error) => {
        reject(error);
      });
      obj.on('httpHeaders', (status, headers) => {
        // 300 is rather arbitrary, but 200 and 204 must be considered successful.
        if (status < 300) {
          const contentType = (headers['content-type'] || null) as Mime;
          resolve({ stream, contentType });
          return;
        }

        reject(new Error('Status code was ' + status));
      });
    });
  }

  public upload(params: any, stream: Stream, contentType: Mime): Promise<void> {
    const Key = compilePath(this.config.path, params);
    const { hash } = params;
    const p: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key,
      Body: stream,
      ContentType: contentType,
      ACL: this.ACL,
      Metadata: {
        'x-amz-meta-hash': hash,
      },
    };

    return new Promise((resolve, reject) => {
      this.S3.upload(p, (err, data) => {
        if (err || !data) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

module.exports = S3Storage;

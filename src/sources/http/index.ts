import fs from 'fs';
import path from 'path';
import request from 'request';
import { Stream } from 'stream';
import compilePath from './../compile-path';
import Source, { SourceParams } from './../source';

export interface HttpSourceConfig {
  root: string;
}

export default class HttpSource extends Source {
  public config: HttpSourceConfig;
  constructor(config: HttpSourceConfig) {
    super(config);
  }

  public exists(params: SourceParams): Promise<Boolean> {
    const url = compilePath(this.config.root, params);
    return new Promise((resolve, reject) => {
      request.head(url, (err, res) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        resolve(!err && (res.statusCode === 200 || res.statusCode === 302));
      });
    });
  }

  public stream(params: SourceParams): Stream {
    const url = compilePath(this.config.root, params);
    return request(url);

  }
}

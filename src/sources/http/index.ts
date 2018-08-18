import fs from 'fs';
import path from 'path';
import request from 'request';
import Source, { SourceParams } from './../source';
import { Stream } from 'stream';
import compilePath from './../compile-path';

export interface HttpSourceConfig {
  root: string;
}

export default class HttpSource extends Source {
  config: HttpSourceConfig;
  constructor(config: HttpSourceConfig) {
    super(config);
  }

  exists(params: SourceParams): Promise<Boolean> {
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

  stream(params: SourceParams): Stream {
    const url = compilePath(this.config.root, params);
    return request(url);

  }
}

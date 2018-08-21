import url from 'url';
import request from 'request';
import { Stream } from 'stream';
import compilePath from './../compile-path';
import Source from './../source';

export interface HttpSourceConfig {
  root: string;
}

export const buildUri = (input: string, params: {}) => {
  const { pathname, ...parts } = url.parse(input);
  return url.format({
    ...parts,
    pathname: compilePath(pathname, params),
  });
};

export default class HttpSource extends Source {
  public config: HttpSourceConfig;
  constructor(config: HttpSourceConfig) {
    super(config);
  }

  public exists(params: {}): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const uri = buildUri(this.config.root, params);
      request.head(uri, (err, res) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
        resolve(!err && (res.statusCode === 200 || res.statusCode === 302));
      });
    });
  }

  public stream(params: {}): Stream {
    const uri = buildUri(this.config.root, params);
    return request(uri);
  }
}

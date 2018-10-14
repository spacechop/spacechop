import request from 'request';
import { Stream } from 'stream';
import url from 'url';
import compilePath from '../../lib/compile-path';
import console from '../../lib/console';
import { SourceOptions } from '../../types/SourceOptions';
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

export default class HttpSource implements Source {
  public config: HttpSourceConfig;
  public options: SourceOptions;
  constructor(config: HttpSourceConfig, options: SourceOptions) {
    this.config = config;
    this.options = options;
  }

  public exists(params: {}): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const uri = buildUri(this.config.root, params);
      request.head(uri, (err, res) => {
        if (err) {
          console.error('Communicating with HTTP source failed with following error:');
          console.error(err);
          console.error('Is it correctly configured?');
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

import fs from 'fs';
import { Stream } from 'stream';
import url from 'url';
import compilePath from './../compile-path';
import Source from './../source';

export interface VolumeSourceConfig {
  root: string;
}

export const buildUri = (input: string, params: {}) => {
  const { pathname, ...parts } = url.parse(input);
  return url.format({
    ...parts,
    pathname: compilePath(pathname, params),
  });
};

export default class VolumeSource implements Source {
  public config: VolumeSourceConfig;
  constructor(config: VolumeSourceConfig) {
    this.config = config;
  }

  public exists(params: {}): Promise<boolean> {
    return new Promise((resolve) => {
      const uri = buildUri(this.config.root, params);
      return resolve(fs.existsSync(uri));
    });
  }

  public stream(params: {}): Stream {
    const uri = buildUri(this.config.root, params);
    return fs.createReadStream(uri);
  }
}

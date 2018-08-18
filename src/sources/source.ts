import { Stream } from 'stream';

export interface SourceConfig {}
export interface SourceParams {}

export default class Source {
  public config: SourceConfig;

  constructor(config: SourceConfig) {
    this.config = config;
  }

  public exists(params: SourceParams): Promise<Boolean> {
    return Promise.resolve(false);
  }

  public stream(params: SourceParams): Stream {
    return null;
  }
}

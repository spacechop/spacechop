import { Stream } from "stream";

export interface SourceConfig {};
export interface SourceParams {};

export default class Source {
  config: SourceConfig;

  constructor(config: SourceConfig) {
    this.config = config;
  }

  exists(params: SourceParams): Promise<Boolean> {
    return Promise.resolve(false);
  }

  stream(params: SourceParams): Stream {
    return null;
  }
}

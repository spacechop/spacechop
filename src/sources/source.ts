import { Stream } from 'stream';

export default class Source {
  public config: any;

  constructor(config: any) {
    this.config = config;
  }

  public exists(params: any): Promise<boolean> {
    return Promise.resolve(false);
  }

  public stream(params: any): Stream {
    return null;
  }
}

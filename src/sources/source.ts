import { Stream } from 'stream';

export default interface Source {
  key(params: any): string;
  exists(params: any): Promise<boolean>;
  stream(params: any): Stream;
}

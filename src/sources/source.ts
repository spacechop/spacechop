import { Readable } from 'stream';

export default interface Source {
  exists(params: any): Promise<boolean>;
  stream(params: any): Stream;
}

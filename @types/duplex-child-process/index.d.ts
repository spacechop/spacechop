
declare module 'duplex-child-process' {
  import { Duplex } from "stream";
  export function spawn(command: string, args?: ReadonlyArray<string>, options?: any): Duplex;
}

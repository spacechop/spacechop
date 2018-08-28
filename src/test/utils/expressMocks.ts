import * as t from 'jest-express';
import { EventEmitter } from 'events';

// jest-express.Response does not implement EventEmitter 
// so piping to the response does not work
export class Response extends t.Response implements EventEmitter {
  on() { return this }
  write() {}
  once () { return this }
  addListener () { return this}
  prependListener() { return this}
  prependOnceListener() { return this}
  removeListener() { return this}
  removeAllListeners() { return this}
  off() { return this }
  setMaxListeners() { return this }
  getMaxListeners() { return 0 }
  listeners() { return [] }
  rawListeners() { return [] }
  emit() { return true }
  eventNames() { return []}
  listenerCount() { return 0 }
};

export class Request extends t.Request {};
